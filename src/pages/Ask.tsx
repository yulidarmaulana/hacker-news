import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import AskCard from '../components/ask/AskCard'
import { Outlet } from 'react-router-dom'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { FC, useEffect, useState } from 'react'
import Skeleton from '../components/ui/Skeleton'
import { AskService } from '../service/AskService'
import { Link } from 'react-router-dom'


interface Ask {
	id: number
	by: string
	time: number
	url: string
  kids?: number[]
  score?: number[]
  title: string
  text: string
}

const Ask: FC = () => {
	const [stories, setStories] = useState<Ask[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchStories = async () => {
			try {
				setLoading(true);
				const data = await AskService('askstories');
				setStories(data);
				setLoading(false);
			} catch (err) {
				setError('Failed to fetch stories');
				setLoading(false);
			}
		};

		fetchStories();
	}, []);

	if (loading) {
		return (
			<div className='flex h-screen overflow-hidden bg-zinc-800'>
				<Sidebar />

				<div className='flex flex-1 flex-col'>
					<Navbar />

					<div className='flex-1 gap-2 overflow-y-auto px-4 py-4 pb-16'>
						<Skeleton />
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return  (
			<div className='flex h-screen overflow-hidden'>
			<Sidebar />

			<div className='flex-1 overflow-y-auto px-4 py-4 pb-16'>
				<div className='flex h-full items-center justify-center'>
					<p>Error...</p>
					
				</div>
			</div>
		</div>
    )
	}

	return (
		<>
			<div className='flex h-screen overflow-hidden bg-zinc-800'>
				<Sidebar />

				<div className='flex flex-1 flex-col'>
					<Navbar />
					<div className='flex-1 overflow-y-auto px-4 py-4 pb-16 md:pb-2 lg:pb-2'>
            
						<ul className='flex flex-col'>
							{stories.map(ask => (
								<li key={ask.id} className='bg-zinc-800 p-3'>
									<div className="">
									<a href={ask.url} target='_blank' rel='noopener noreferrer' className='text-zinc-100 hover:text-zinc-500'>
										<Link to={`/ask/${ask.id}`}>
											<AskCard {...ask} />
										</Link>
									</a>
									</div>
								</li>
							))}
						</ul>

						<Outlet />
					</div>
				</div>
				
			</div>
		</>
	)
}

export default Ask
