import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import { TrendingUp, MessageSquareMore } from 'lucide-react';
import Skeleton from '../ui/Skeleton'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface Story {
	by: string
	descendants: number
	id: number
	kids: number[]
	score: number
	time: number
	title: string
	type: string
	url: string
  text?: string | undefined
}

const StoryDetail = () => {
	const { id } = useParams<{ id: string }>()
	const [story, setStory] = useState<Story | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)


	// Mengambil domain dari URL menggunakan ekspresi reguler
  // const domain = story?.url.replace(/(^\w+:|^)\/\//, '').split('/')[0];

	useEffect(() => {
		const fetchStory = async () => {
			try {
				const response = await axios.get<Story>(
					`https://hacker-news.firebaseio.com/v0/item/${id}.json`
				)
				setStory(response.data)
				setLoading(false)
			} catch (error) {
				setError('Failed to fetch story')
				setLoading(false) 
			}
		}

		fetchStory()
	}, [id])


	if (loading) {
		return (
			<div className='flex h-screen overflow-hidden dark:bg-zinc-800 bg-mystic-300'>
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
		return (
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
			<div className='flex h-screen overflow-hidden dark:bg-zinc-800 bg-mystic-300'>
				<Sidebar />
				<div className='flex flex-1 flex-col'>
					<Navbar />

					<div className='flex-1 overflow-y-auto px-4 py-4 pb-20 md:pb-2 lg:pb-2'>
						{story && (
							<div className='px-3'>

								<a href={story.url} target='_blank'>
										<h2 className='text-xl  font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-500'>
											{story.title}
										</h2>										
								</a>

                <p className='mb-2 text-sm text-zinc-500'>
											{dayjs.unix(story.time).fromNow()}
								</p>

								<div className='flex gap-3'>
									<p className='text-sm text-zinc-400'>By: {story.by}</p>
									<p className='text-sm text-zinc-400 '>
										Time: {new Date(story.time * 1000).toLocaleString()}
									</p>
								</div>
								<p className='text-sm text-zinc-400'>
									Source :{' '}
									<a
										href={story.url}
										target='_blank'
										rel='noopener noreferrer'
										className='text-sm text-zinc-400 hover:text-zinc-50'
									>
										{story.url}
									</a>
								</p>

								<div className='my-2 flex gap-6'>
									{story.score && (
										<p className='flex gap-1 text-sm text-zinc-400'>
											<TrendingUp className='h-4 w-4 self-center' />{' '}
											{story.score}{' '}
										</p>
									)}
									{story.kids && (
										<p className='flex gap-1 text-sm text-zinc-400'>
											<MessageSquareMore className='h-4 w-4 self-center' />{' '}
											{story.kids.length}{' '}
										</p>
									)}
								</div>
								<div className='h-[2px] w-full bg-zinc-700'></div>
								{/* <StoryComment /> */}
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default StoryDetail
