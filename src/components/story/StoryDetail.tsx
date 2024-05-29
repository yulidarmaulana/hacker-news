import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import { TrendingUp, MessageSquareMore } from 'lucide-react';
import Skeleton from '../ui/Skeleton'
import StoryComment from './StoryComment'

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
  const domain = story?.url.replace(/(^\w+:|^)\/\//, '').split('/')[0];

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
					<div className='flex-1 gap-2 overflow-y-auto px-4 py-4 '>
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
		<>
			<div className='flex h-screen overflow-hidden dark:bg-zinc-800 bg-mystic-300'>
				<Sidebar />
				<div className='flex flex-1 flex-col w-full'>
					<Navbar />

					<div className='flex-1 overflow-y-auto px-4'>
						{story && (
							<div className='p-3'>
								<h2 className='my-2 text-xl font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-600'>
									{story.title}
								</h2>
								<div className='flex gap-3'>
									<p className='text-sm text-zinc-400'>By: {story.by}</p>
									<p className='text-sm text-zinc-400 '>
										Date: {new Date(story.time * 1000).toLocaleString()}
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
										{domain}
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
								<div className='h-[2px] bg-zinc-700'>
									<StoryComment />
								</div>
								<hr className='border-mystic-200 dark:border-zinc-600' />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default StoryDetail
