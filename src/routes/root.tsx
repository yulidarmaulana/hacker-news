import Sidebar from "../components/Sidebar"
// import { Outlet } from "react-router-dom"

const Root = () => {
	return (
		<>
		<div className="flex h-screen overflow-hidden bg-zinc-700">
			
			<Sidebar />
			
			<div className='flex flex-1 flex-col'>
					<div className='flex-1 overflow-y-auto px-4 py-4'>
						<p className="text-2xl text-zinc-50">Feed</p>
					</div>
			</div>
		</div>
		</>
	)
}

export default Root
