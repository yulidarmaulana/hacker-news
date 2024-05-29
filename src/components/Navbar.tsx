import { useLocation } from 'react-router-dom'
import { Sun, Moon, ArrowLeft } from 'lucide-react'

import { useState } from 'react'

const Navbar = () => {


  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.documentElement.classList.toggle('dark');
  }

  // Fungsi untuk menentukan apakah ikon ArrowLeft harus disembunyikan
  const isArrowLeftHidden = () => {
    return ['/', '/ask', '/job', '/show'].includes(location.pathname);
  }

  return (
    <>
    <div className="flex h-16 items-center justify-between px-2 bg-mystic-100 dark:bg-zinc-900 ">
      <div className="flex items-center justify-between gap-1">
      {!isArrowLeftHidden() && (
            <ArrowLeft
              className='ml-2 cursor-pointer text-zinc-900 hover:text-mystic-400 dark:text-zinc-200 dark:hover:text-zinc-500'
              onClick={() => window.history.go(-1)}
            />
          )}
        <h1 className="text-xl font-bold ms-4 text-zinc-900 dark:text-zinc-100">{useLocation().pathname}</h1>
      </div>
    
        <div className=""></div>
        <div className=" me-4 dark-mode-toggle hover:bg-zinc-400 dark:hover:bg-zinc-100 dark:hover:text-slate-800 rounded-full p-1" onClick={toggleTheme}>
          {isDarkTheme ? <Sun className='text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-900' /> :  <Moon className='text-zinc-900 dark:text-zinc-100 dark:hover:text-zinc-900' />}
        </div>
    </div>
    </>
  )
}

export default Navbar