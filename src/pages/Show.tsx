import { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Skeleton from '../components/ui/Skeleton'
import ShowCard from '../components/show/ShowCard'
import {ShowService} from '../service/ShowService'


interface Show {
	id: number;
	title: string;
	url: string;
	by: string;
	time: number;
}


const Show: FC = () => {
	const [stories, setStories] = useState<Show[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchStories = async () => {
			try {
				setLoading(true);
				const data = await ShowService('showstories');
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

			<div className='flex-1 overflow-y-auto px-4 py-4'>
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
							{stories.map(show => (
								<li key={show.id} className='bg-zinc-800 p-3'>
									<div className=''>
										<a
											href={show.url}
											target='_blank'
											rel='noopener noreferrer'
											className='text-zinc-100 hover:text-zinc-500'
										>
											<Link to={`/show/${show.id}`}>
												<ShowCard {...show} />
											</Link>
										</a>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</>
	)
}

export default Show
