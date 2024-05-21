import { FC } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StoryCard from '../components/story/StoryCard';

import { Link } from 'react-router-dom';
import Skeleton from '../components/ui/Skeleton';
import useFetchStories from '../hooks/useFetchStories';

interface Story {
  id: number;
  title: string;
  url?: string;
  by: string;
  time: number;
}

const Story: FC = () => {
  const apiUrl = 'https://hacker-news.firebaseio.com/v0';
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useFetchStories(apiUrl);
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
				<div>Error: {error?.message}</div>
					
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
        <hr className='border-zinc-700 dark:border-zinc-800 h-[2px]' />
        <div className='flex gap-2 p-2'>
          {/* Story buttons can be added here */}
        </div>
        <hr className='border-zinc-700 dark:border-zinc-800 h-[2px]' />

        <div className='flex-1 overflow-y-auto px-4 py-4 pb-24'>
          <ul className='flex flex-col'>
            {data?.pages.map((page, pageIndex) => (
              <ul key={pageIndex}>
                {page.data.map((story: Story) => (
                  <li key={story.id} className='bg-zinc-800 p-3'>
                    <a
                      href={story.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-lg text-zinc-50 hover:text-zinc-600'
                    >
                      <Link to={`/story/${story.id}`}>
                        <StoryCard key={story.id} {...story} />
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
              {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'More' : 'Nothing more to load'}
            </button>
            <div>{isFetching && !isFetchingNextPage ? '' : null}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
