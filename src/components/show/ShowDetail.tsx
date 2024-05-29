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
import ShowComment from './ShowComment'

interface Show {
	by: string
	descendants: number
	id: number
  kids?: Show[];
	score: number
	time: number
	title: string
	type: string
	url: string
  text?: string | undefined
}

const ShowDetail = () => {
	const { id } = useParams<{ id: string }>()
	const [show, setShow] = useState<Show | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
  const [expandedDetails, setexpandedDetails] = useState<number[]>([]);


	// Mengambil domain dari URL menggunakan ekspresi reguler
  const domain = show?.url.replace(/(^\w+:|^)\/\//, '').split('/')[0];

	useEffect(() => {
		const fetchStory = async () => {
			try {
				const response = await axios.get<Show>(
					`https://hacker-news.firebaseio.com/v0/item/${id}.json`
				)
				setShow(response.data)
				setLoading(false)
			} catch (error) {
				setError('Failed to fetch story')
				setLoading(false) 
			}
		}

		fetchStory()
	}, [id])

	const toggleExpandDetail = (detailId: number) => {
    if (expandedDetails.includes(detailId)) {
      setexpandedDetails(expandedDetails.filter(id => id !== detailId));
    } else {
      setexpandedDetails([...expandedDetails, detailId]);
    }
  };

  const isDetailExpanded = (detailId: number) => {
    return expandedDetails.includes(detailId);
  };

  const shouldShowReadMore = (detail: Show) => {
    return detail.text && detail.text.length >= 1000;
  };
  

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
				<div className='flex w-full flex-1 flex-col'>
					<Navbar />

					<div className='flex-1 overflow-y-auto px-4 py-4 pb-20 md:pb-2 lg:pb-2'>
						{show && (
							<div className='p-3'>
								<a href={show.url} target='_blank'>
									<h2 className='text-xl  font-medium text-zinc-900 dark:text-zinc-100 hover:text-zinc-500'>
										{show.title}
									</h2>
								</a>

								<p className='mb-2 text-sm text-zinc-500'>
									{dayjs.unix(show.time).fromNow()}
								</p>

								<div className='flex gap-3'>
									<p className='text-sm text-zinc-400'>By: {show.by}</p>
									<p className='text-sm text-zinc-400 '>
										Time: {new Date(show.time * 1000).toLocaleString()}
									</p>
								</div>
								<p className='text-sm text-zinc-400'>
									Source :{' '}
									<a
										href={show.url}
										target='_blank'
										rel='noopener noreferrer'
										className='text-sm text-zinc-400 hover:text-zinc-50'
									>
										{domain}
									</a>
								</p>

								<div
										className={`my-2 text-zinc-700 dark:text-zinc-100 ${isDetailExpanded(show.id) ? '' : 'max-h-[100px] overflow-hidden'}`}
										dangerouslySetInnerHTML={{ __html: show.text ?? '' }}
									/>
									{shouldShowReadMore(show) && (
										<button
											className='text-blue-500 hover:text-blue-50'
											onClick={() => toggleExpandDetail(show.id)}
										>
											{isDetailExpanded(show.id)
												? ' less'
												: ' more'}
										</button>
									)}

								<div className='my-2 flex gap-6'>
									{show.score && (
										<p className='flex gap-1 text-sm text-zinc-400'>
											<TrendingUp className='h-4 w-4 self-center' />{' '}
											{show.score}{' '}
										</p>
									)}
									{show.kids && (
										<p className='flex gap-1 text-sm text-zinc-400'>
											<MessageSquareMore className='h-4 w-4 self-center' />{' '}
											{show.kids.length}{' '}
										</p>
									)}
								</div>
								<div className='h-[2px] bg-zinc-700'></div>
								<ShowComment />
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default ShowDetail
