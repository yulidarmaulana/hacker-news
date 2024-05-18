import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import JobCard from '../components/job/JobCard'

import { FC, useEffect, useState } from 'react'
import axios from 'axios'
import Skeleton from '../components/ui/Skeleton'

import { Link } from 'react-router-dom'

interface Job {
	id: number
	title: string
	url: string
}

const CACHE_EXPIRATION_TIME = 600000

const Job: FC = () => {
	const [stories, setStories] = useState<Job[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchStories = async () => {
			try {
				const cachedData = localStorage.getItem('jobStories')
				const cacheExpiration = localStorage.getItem('jobStories_expiration')

				if (
					cachedData &&
					cacheExpiration &&
					Date.now() - parseInt(cacheExpiration) < CACHE_EXPIRATION_TIME
				) {
					setStories(JSON.parse(cachedData))
					setLoading(false)
				} else {
					const jobStories = await axios.get<number[]>(
						'https://hacker-news.firebaseio.com/v0/jobstories.json'
					)
					const jobPromises = jobStories.data
						.slice(0, 20)
						.map(jobId =>
							axios.get<Job>(
								`https://hacker-news.firebaseio.com/v0/item/${jobId}.json`
							)
						)
					const storiesData = await Promise.all(jobPromises)
					const newData = storiesData.map(response => response.data)

					localStorage.setItem('jobStories', JSON.stringify(newData))
					localStorage.setItem('jobStories_expiration', Date.now().toString())

					setStories(newData)
					setLoading(false)
				}
			} catch (err) {
				setError('Failed to fetch stories')
				setLoading(false)
			}
		}

		fetchStories()
	}, [])

	if (loading) {
		return (
			<div className='flex h-screen overflow-hidden bg-zinc-800'>
				<Sidebar />

				<div className='flex flex-1 flex-col'>
					<Navbar />

					<div className='flex-1 gap-2 overflow-y-auto px-4 py-4'>
						<Skeleton />
					</div>
				</div>
			</div>
		)
	}

	if (error) {
		return (
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
		<div className='flex h-screen overflow-hidden bg-zinc-800'>
			<Sidebar />

			<div className='flex flex-1 flex-col'>
				<Navbar />

				<div className='flex-1 overflow-y-auto px-4 py-4 pb-16 md:pb-2 lg:pb-2'>
					<ul className='flex flex-col'>
						{stories.map(job => (
							<li key={job.id} className='bg-zinc-800 p-3'>
								<a
									href={job.url}
									target='_blank'
									rel='noopener noreferrer'
									className='text-lg text-zinc-50 hover:text-zinc-600'
								>
									<Link to={`/job/${job.id}`}>
									<JobCard by={''} time={0} {...job} />
									</Link>
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
}

export default Job
