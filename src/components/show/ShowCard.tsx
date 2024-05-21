// import { useState } from 'react';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { MessageSquareMore, TrendingUp } from 'lucide-react';

dayjs.extend(relativeTime)

interface ShowCardProps {
  title: string
  by: string
  time: number
  url: string
  kids?: number[]
  score?: number[]
}

const ShowCard = ({ title, by, time, url, kids, score}: ShowCardProps) => {

  if (!url) {
    return <div>Error: URL is not provided</div>;
  }

  // Extract domain from URL using regular expression
  const domain = url.replace(/(^\w+:|^)\/\//, '').split('/')[0];

  return (
    <>
      <div className='flex items-stretch gap-2'>
        <p className='text-sm text-zinc-400'>{by}</p>
        <div className="flex">
          <p className='self-center text-sm text-zinc-500'>
            {dayjs.unix(time).fromNow()}
          </p>
        </div>
      </div>
      <div className="my-2">
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-lg text-zinc-50 hover:text-zinc-600'
        >
          {title}
        </a>

        <p className='text-sm text-zinc-400 hover:text-zinc-100 mb-2'>{domain}</p>
        
      </div>
      <div className="mb-3 flex gap-6">
        {score && <p className="text-sm text-zinc-400 flex gap-1"><TrendingUp className="w-4 h-4 self-center" /> {score} </p>}
        {kids && <p className="text-sm text-zinc-400 flex gap-1 "><MessageSquareMore className="w-4 h-4 self-center" />  {kids.length ?? 0} </p>}
      </div>
      <hr className='border-zinc-700 dark:border-zinc-800 h-[2px]' />
    </>
  )
}

export default ShowCard
