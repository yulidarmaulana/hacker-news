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
	kids: number[]
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

	// Mengambil domain dari URL menggunakan ekspresi reguler
  const domain = show?.url.replace(/(^\w+:|^)\/\//, '').split('/')[0];

	useEffect(() => {
		const fetchShow = async () => {
			try {
				const cachedData = localStorage.getItem(`show_${id}`);
				if (cachedData) {
					setShow(JSON.parse(cachedData));
					setLoading(false);
				} else {
					const response = await axios.get<Show>(
						`https://hacker-news.firebaseio.com/v0/item/${id}.json`
					);
					const showData = response.data;
					setShow(showData);
					localStorage.setItem(`show_${id}`, JSON.stringify(showData));
					setLoading(false);
				}
			} catch (error) {
				setError('Failed to fetch show');
				setLoading(false);
			}
		};

		fetchShow();
	}, [id]);

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
			<div className='flex h-screen overflow-hidden bg-zinc-800'>
				<Sidebar />
				<div className='flex flex-1 flex-col w-full'>
					<Navbar />

					<div className='flex-1 overflow-y-auto px-4 py-4 pb-20 md:pb-2 lg:pb-2'>
						{show && (
							<div className='p-3'>

								<a href={show.url} target='_blank'>
										<h2 className='text-xl  font-medium text-zinc-100 hover:text-zinc-500'>
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
          className={`my-2 text-zinc-300`}
          dangerouslySetInnerHTML={{ __html: show.text ?? '' }}
        />


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
								<div className='h-[2px] w-full bg-zinc-700'></div>
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
