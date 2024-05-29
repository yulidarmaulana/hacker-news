import { FC, useState } from 'react';
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
  const [storyType, setStoryType] = useState<'topstories' | 'newstories' | 'beststories'>('topstories');
  const [lastClickedButton, setLastClickedButton] = useState<string>('');

  const handleStoryTypeChange = (type: 'topstories' | 'newstories' | 'beststories', buttonId: string) => {
    setStoryType(type);
    setLastClickedButton(buttonId);
  };

  // Use the custom hook with apiUrl and storyType
  const { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status } = useFetchStories(apiUrl, storyType);

  if (status === 'pending') {
    return (
			<div className='flex h-screen overflow-hidden dark:bg-zinc-800 bg-mystic-300'>
				<Sidebar />
				<div className='flex flex-1 flex-col'>
					<Navbar />

					<hr className='h-[2px] border-mystic-100 dark:border-zinc-600' />
					<div className='flex gap-2 p-2'>
						{/* Story buttons can be added here */}
						<button
							onClick={() => handleStoryTypeChange('topstories', 'top')}
							className={`text-md px-4 hover:text-zinc-50 ${lastClickedButton === 'top' ? 'text-zinc-50' : 'text-zinc-400'}`}
						>
							Top Stories
						</button>
						<button
							onClick={() => handleStoryTypeChange('newstories', 'new')}
							className={`text-md px-4 hover:text-zinc-50 ${lastClickedButton === 'new' ? 'text-zinc-50' : 'text-zinc-400'}`}
						>
							New Stories
						</button>
						<button
							onClick={() => handleStoryTypeChange('beststories', 'best')}
							className={`text-md px-4 hover:text-zinc-50 ${lastClickedButton === 'best' ? 'text-zinc-50' : 'text-zinc-400'}`}
						>
							Best Stories
						</button>
					</div>
					<hr className='h-[2px] border-mystic-100 dark:border-zinc-600' />

					<div className='flex-1 gap-2 overflow-y-auto px-4 py-4 pb-16'>
						<Skeleton />
					</div>
				</div>
			</div>
		)
  }

  if (status === 'error') {
    return (
      <div className='flex h-screen overflow-hidden'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto px-4 py-4'>
          <div className='flex h-full items-center justify-center'>
            <div>Error: {error?.message}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-screen overflow-hidden dark:bg-zinc-800 bg-mystic-300'>
      <Sidebar />
      <div className='flex flex-1 flex-col'>
        <Navbar />
        <hr className='border-mystic-300 dark:border-zinc-800 h-[2px]' />
        <div className='flex gap-2 p-2'>
          {/* Story buttons can be added here */}
          <button
            onClick={() => handleStoryTypeChange('topstories', 'top')}
            className={`text-md px-4 text-zinc-900 dark:text-mystic-100 hover:text-zinc-400 ${lastClickedButton === 'top' ? 'text-zinc-400' : 'text-zinc-50'}`}
          >
            Top Stories
          </button>
          <button
            onClick={() => handleStoryTypeChange('newstories', 'new')}
            className={`text-md px-4 text-zinc-900 dark:text-mystic-100 hover:text-zinc-400 ${lastClickedButton === 'new' ? 'text-zinc-400' : 'text-zinc-50'}`}
          >
            New Stories
          </button>
          <button
            onClick={() => handleStoryTypeChange('beststories', 'best')}
            className={`text-md px-4 text-zinc-900 dark:text-mystic-100 hover:text-zinc-400 ${lastClickedButton === 'best' ? 'text-zinc-400' : 'text-zinc-50'}`}
          >
            Best Stories
          </button>
        </div>
        <hr className='border-mystic-500 dark:border-zinc-600 h-[2px]' />

        <div className='flex-1 overflow-y-auto p-4 pb-20 md:pb-2 lg:pb-2'>
          <ul className='flex flex-col'>
            {data?.pages.map((page, pageIndex) => (
              <ul key={pageIndex}>
                {page.data.map((story: Story) => (
                  <li key={story.id} className='dark:bg-zinc-800  p-3'>
                    <a
                      href={story.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-lg text-zinc-900 dark:text-zinc-50 hover:text-zinc-600'
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
              className={`text-md px-4 pb-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-50 dark:hover:text-zinc-400`}
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
