import React from 'react'

const Header = () => {
  return (
    <header className="flex items-center justify-between gap-4 p-4">
        <a href="/"><h1 className='font-medium'>Trans<span className="text-red-500 bold">Lingo</span></h1></a>
        <a href = "/" className="flex items-center gap-2 specialBtn px-3 text-sm py-2 rounded-lg text-red-500">
        <p>New</p>
        <i className="fa-solid fa-plus"></i>
        </a>
    </header>
  )
}

export default Header
