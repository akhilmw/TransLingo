import React from 'react'

const FileDisplay = (props) => {

    const { file, audioStream, handleAudioReset, handleFormSubmission } = props

    return (
        <main className="flex-1 p-4 flex flex-col gap-3 sm:gap-4
    justify-center text-center w-72 sm:w-96 pb-20  max-w-full mx-auto">
            <h1 className='font-semibold text-4xl sm:text-5xl md:text-6xl'>Your<span className='text-red-500 bold'>File</span></h1>
            <div className='flex flex-col text-left my-4'>
                <h3 className='font-semibold'>Name</h3>
                <p>{file ? file?.name : 'Custom Audio'}</p>
            </div>
            <div className='flex items-center justify-between gap-4'>
                <button onClick={handleAudioReset} className='text-slate-400 hover:text-red-600 duration-200'>Reset</button>
                <button onClick={handleFormSubmission} className='specialBtn px-3 p-2 rounded-lg text-red-500 flex items-center gap-2 font-medium'>
                    <p>Transcribe</p>
                    <i className="fa-solid fa-pen-to-square"></i>
                </button>
            </div>
        </main>
    )
}

export default FileDisplay
