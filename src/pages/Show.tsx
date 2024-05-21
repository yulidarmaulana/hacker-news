import { FC } from 'react'
import { Link } from 'react-router-dom'

import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import Skeleton from '../components/ui/Skeleton'
import ShowCard from '../components/show/ShowCard'

import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';


interface Show {
	id: number;
	title: string;
	url: string;
	by: string;
	time: number;
	text?: string | undefined;
}

const Show: FC = () => {
  
	const fetchShow = async ({ pageParam = 0 }) => {
    const showStories = await axios.get<number[]>(
      'https://hacker-news.firebaseio.com/v0/showstories.json'
    );
    const jobPromises = showStories.data
      .slice(pageParam, pageParam + 20)
      .map((showId: number) =>
        axios.get<Show>(`https://hacker-news.firebaseio.com/v0/item/${showId}.json`)
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
    queryKey: ['showStories'],
    queryFn: fetchShow,
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

			<div className='flex-1 overflow-y-auto px-4 py-4'>
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

				<div className='flex w-full flex-1 flex-col'>
					<Navbar />
					<div className='flex-1 overflow-y-auto px-4 py-4 pb-24 md:pb-2 lg:pb-2'>
						<ul className='flex flex-col'>
							{data?.pages.map((page, pageIndex) => (
								<ul key={pageIndex}>
									{page.data.map((show: Show) => (
										<li key={show.id} className='bg-zinc-800 p-3'>
											<a
												href={show.url}
												target='_blank'
												rel='noopener noreferrer'
												className='text-lg text-zinc-50 hover:text-zinc-600'
											>
												<Link to={`/show/${show.id}`}>
													<ShowCard key={show.id} {...show} />
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
								className={`text-md px-4 text-zinc-50 hover:text-zinc-400`}
							>
								{isFetchingNextPage === true
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

export default Show
