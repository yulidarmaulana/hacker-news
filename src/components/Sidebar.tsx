import { SquareCode, CircleHelp, BriefcaseBusiness, Rocket } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive'
import { useLocation } from 'react-router-dom'

const Sidebar = () => {
	const location = useLocation()
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

	return (
		<div className={`flex w-64 flex-col bg-mystic-100 dark:bg-zinc-900 ${isMobile ? 'fixed bottom-0 z-0 flex-row h-fit w-screen' : 'h-screen'}`}>
			<div className={`flex flex-col items-start px-8 pt-5 ${isMobile ? 'hidden' : ''}`}>
				<h1 className={`text-lg font-medium text-zinc-900 dark:text-mystic-100`}>hackernews.</h1>
			</div>

      
			<nav className={`flex ${isMobile ? 'flex-row gap-2 overflow-y-auto' : 'flex-col gap-2 overflow-y-visible'} items-center p-4`}>
				<NavLink
					to='/'
					className={`flex w-full items-center justify-start rounded-lg px-4 py-2 text-zinc-900 dark:text-mystic-100 dark:hover:bg-zinc-600 hover:bg-mystic-300 ${isMobile ? 'justify-center' : ''} ${location.pathname === '/' || location.pathname === `/story/${location.pathname.split('/')[2]}` ? 'bg-mystic-300 dark:bg-zinc-600 dark:hover:bg-zinc-600' : ''}`}
				>
					<SquareCode className={`w-5 h-5 ${isMobile ? 'hidden' : ''}`} />
					<span className='mx-2'>Feed</span>
				</NavLink>

				<NavLink
					to='/ask'
					className={`flex w-full items-center justify-start rounded-lg px-4 py-2 text-zinc-900 dark:text-mystic-100 dark:hover:bg-zinc-600 hover:bg-mystic-300 ${isMobile ? 'justify-center' : ''} ${location.pathname === '/ask' || location.pathname === `/ask/${location.pathname.split('/')[2]}` ? 'bg-mystic-300 dark:bg-zinc-600 dark:hover:bg-zinc-600' : ''}`}
				>
					<CircleHelp className={`w-5 h-5 ${isMobile ? 'hidden' : ''}`} />
					<span className='mx-2'>Ask</span>
				</NavLink>

				<NavLink
					to='/job'
					className={`flex w-full items-center justify-start rounded-lg px-4 py-2 text-zinc-900 dark:text-mystic-100 dark:hover:bg-zinc-600 hover:bg-mystic-300 ${isMobile ? 'justify-center' : ''} ${location.pathname === '/job' || location.pathname === `/job/${location.pathname.split('/')[2]}` ? 'bg-mystic-300 dark:bg-zinc-600 dark:hover:bg-zinc-600' : ''}`}
				>
					<BriefcaseBusiness className={`w-5 h-5 ${isMobile ? 'hidden' : ''}`} />
					<span className='mx-2'>Job</span>
				</NavLink>

				<NavLink
					to='/show'
					className={`flex w-full items-center justify-start rounded-lg px-4 py-2 text-zinc-900 dark:text-mystic-100 dark:hover:bg-zinc-600 hover:bg-mystic-300 ${isMobile ? 'justify-center' : ''} ${location.pathname === '/show' || location.pathname === `/show/${location.pathname.split('/')[2]}` ? 'bg-mystic-300 dark:bg-zinc-600 dark:hover:bg-zinc-600' : ''}`}
				>
					<Rocket className={`w-5 h-5 ${isMobile ? 'hidden' : ''}`} />
					<span className='mx-2'>Show</span>
				</NavLink>
			</nav>
		</div>
	)
}

export default Sidebar
