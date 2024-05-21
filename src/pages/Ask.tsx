import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import AskCard from '../components/ask/AskCard'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import { FC } from 'react'
import Skeleton from '../components/ui/Skeleton'
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

	const fetchJobs = async ({ pageParam = 0 }) => {
    const askStories = await axios.get<number[]>(
      'https://hacker-news.firebaseio.com/v0/askstories.json'
    );
    const jobPromises = askStories.data
      .slice(pageParam, pageParam + 20)
      .map((askId: number) =>
        axios.get<Ask>(`https://hacker-news.firebaseio.com/v0/item/${askId}.json`)
      );
    const storiesData = await Promise.all(jobPromises);
    const newData = storiesData.map((response) => response.data);
    return { data: newData, nextPageParam: pageParam + 20 };
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['askStories'],
    queryFn: fetchJobs,
    initialPageParam: 0, // Tambahkan initialPageParam di sini
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

	if (status === 'pending') {
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

	if (status === 'error') {
		return  (
			<div className='flex h-screen overflow-hidden'>
			<Sidebar />

			<div className='flex-1 overflow-y-auto px-4 py-4 pb-16'>
				<div className='flex h-full items-center justify-center'>
					<p>Error: {error.message}</p>
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
					<div className='flex-1 overflow-y-auto px-4 py-4 pb-24 md:pb-2 lg:pb-2'>
            
						<ul className='flex flex-col'>
						{data?.pages.map((page, pageIndex) => (
              <ul key={pageIndex}>
                {page.data.map((ask: Ask) => (
                  <li key={ask.id} className='bg-zinc-800 p-3'>
                    <a
                      href={ask.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-lg text-zinc-50 hover:text-zinc-600'
                    >
                      <Link to={`/ask/${ask.id}`}>
                        <AskCard {...ask} />
                      </Link>
                    </a>
                  </li>
                ))}
              </ul>
            ))}
						</ul>
						<div>
            <button
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className='text-md text-zinc-50 hover:text-zinc-400 px-4'
            >
              {isFetchingNextPage
                ? 'Loading...'
                : hasNextPage
                ? 'More' 
                : 'Nothing more to load'}
            </button>
            <div>{isFetching && !isFetchingNextPage ? '' : null}</div>
          </div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Ask
