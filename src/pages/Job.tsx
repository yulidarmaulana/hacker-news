import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import Skeleton from '../components/ui/Skeleton';
import { FC } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import JobCard from '../components/job/JobCard';

interface Job {
  id: number;
  title: string;
  url: string;
}

const Job: FC = () => {
  const fetchJobs = async ({ pageParam = 0 }) => {
    const jobStories = await axios.get<number[]>(
      'https://hacker-news.firebaseio.com/v0/jobstories.json'
    );
    const jobPromises = jobStories.data
      .slice(pageParam, pageParam + 20)
      .map((jobId: number) =>
        axios.get<Job>(`https://hacker-news.firebaseio.com/v0/item/${jobId}.json`)
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
    queryKey: ['jobStories'],
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
          <div className='flex-1 gap-2 overflow-y-auto px-4 py-4'>
            <Skeleton />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className='flex h-screen overflow-hidden'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto px-4 py-4'>
          <div className='flex h-full items-center justify-center'>
            <p>Error: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='flex h-screen overflow-hidden bg-zinc-800'>
      <Sidebar />
      <div className='flex flex-1 flex-col'>
        <Navbar />
        <div className='flex-1 overflow-y-auto px-4 py-4 pb-24 md:pb-2 lg:pb-2'>
          <ul className='flex flex-col'>
            {data?.pages.map((page, pageIndex) => (
              <ul key={pageIndex}>
                {page.data.map((job: Job) => (
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
  );
};

export default Job;
