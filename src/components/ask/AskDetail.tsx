import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/Navbar'
import { TrendingUp, MessageSquareMore } from 'lucide-react';
import Skeleton from '../ui/Skeleton'
import AskComment from './AskComment'

interface Ask {
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

const AskDetail = () => {
	const { id } = useParams<{ id: string }>()
	const [story, setStory] = useState<Ask | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)


	// Mengambil domain dari URL menggunakan ekspresi reguler
  // const domain = story?.url.replace(/(^\w+:|^)\/\//, '').split('/')[0];

	useEffect(() => {
		const fetchStory = async () => {
			try {
				const response = await axios.get<Ask>(
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
			<div className='flex h-screen overflow-hidden bg-zinc-800'>
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
			<div className='flex h-screen overflow-hidden bg-zinc-800'>
				<Sidebar />
				<div className='flex flex-1 flex-col w-full'>
					<Navbar />

					<div className='flex-1 overflow-y-auto px-4 py-4 pb-20 md:pb-2 lg:pb-2'>
						{story && (
							<div className='p-3'>
								<h2 className='my-2 text-xl font-medium text-zinc-100'>
									{story.title}
								</h2>
								<div className='flex gap-3'>
									<p className='text-sm text-zinc-400'>By: {story.by}</p>
									<p className='text-sm text-zinc-400 '>
										Time: {new Date(story.time * 1000).toLocaleString()}
									</p>
								</div>

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
									<AskComment />
								</div>
								<hr className='h-[2px] border-zinc-700 dark:border-zinc-800' />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default AskDetail