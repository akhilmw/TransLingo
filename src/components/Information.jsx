import React, { useState, useEffect, useRef } from 'react';
import Transcription from './Transcription';
import Translation from './Translation';

const Information = (props) => {
    const { output } = props;
    const [tab, setTab] = useState('transcription');
    const [translation, setTranslation] = useState(null);
    const [toLanguage, setToLanguage] = useState('Select language');
    const [translating, setTranslating] = useState(false); // Initialize as false

    const worker = useRef(null);

    const textElement = tab === 'transcription' ? output.map(val => val.text).join('\n') : translation || '';

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
                type: 'module'
            });
        }

        const onMessageReceived = async (e) => {
            console.log('Message from worker:', e.data); // Debug log
            switch (e.data.status) {
                case 'initiate':
                    // console.log('DOWNLOADING');
                    break;
                case 'progress':
                    // console.log('LOADING');
                    break;
                case 'update':
                    setTranslation(e.data.output);
                    // console.log('Translation update:', e.data.output);
                    break;
                case 'complete':
                    setTranslating(false);
                    console.log('Translation complete');
                    break;
                default:
                    console.log('Unknown message status:', e.data.status);
            }
        };

        worker.current.addEventListener('message', onMessageReceived);

        return () => {
            worker.current.removeEventListener('message', onMessageReceived);
        };
    }, []);

    function handleCopy() {
        navigator.clipboard.writeText(textElement);
    }

    function handleDownload() {
        const element = document.createElement('a');
        const file = new Blob([textElement], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `TransLingo${new Date().toString()}.txt`;
        document.body.appendChild(element);
        element.click();
    }

    function generateTranslation() {
        if (translating || toLanguage === 'Select language') {
            return;
        }

        setTranslating(true);

        worker.current.postMessage({
            text: output.map(val => val.text).join('\n'),
            src_lang: 'eng_Latn',
            tgt_lang: toLanguage
        });
    }

    return (
        <main className='flex-1 p-4 flex flex-col gap-3 text-center sm:gap-4 justify-center pb-20 max-w-prose w-full mx-auto'>
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl whitespace-nowrap'>
                Your <span className='text-red-400 bold'>Transcription</span>
            </h1>
            <div className='grid grid-cols-2 mx-auto bg-white shadow rounded-full overflow-hidden items-center'>
                <button onClick={() => setTab('transcription')} className={'px-4 duration-200 py-1 ' + (tab === 'transcription' ? 'bg-red-400 text-white' : 'text-red-400 hover:text-red-600')}>
                    Transcription
                </button>
                <button onClick={() => setTab('translation')} className={'px-4 duration-200 py-1 ' + (tab === 'translation' ? 'bg-red-400 text-white' : 'text-red-400 hover:text-red-600')}>
                    Translation
                </button>
            </div>
            <div className='my-8 flex flex-col-reverse max-w-prose w-full mx-auto gap-4'>
                {tab === 'transcription' ? (
                    <Transcription {...props} textElement={textElement} />
                ) : (
                    <Translation {...props} toLanguage={toLanguage} textElement={textElement} translating={translating} setTranslation={setTranslation} setTranslating={setTranslating} setToLanguage={setToLanguage} generateTranslation={generateTranslation} />
                )}
            </div>
            <div className='flex items-center gap-4 mx-auto'>
                <button onClick={handleCopy} title='Copy' className='bg-white text-red-400 px-2 aspect-square grid place-items-center rounded hover:text-red-300 duration-200'>
                    <i className='fa-solid fa-copy'></i>
                </button>
                <button onClick={handleDownload} title='Download' className='bg-white text-red-400 px-2 aspect-square grid place-items-center rounded hover:text-red-300 duration-200'>
                    <i className='fa-solid fa-download'></i>
                </button>
            </div>
        </main>
    );
};

export default Information;
