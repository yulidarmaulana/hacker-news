import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface JobCardProps {
	title: string
	by: string
	time: number
	url: string
}

const JobCard = ({ title, by, time, url }: JobCardProps) => {

	// if (!url) {
  //   return <div>Error: URL is not provided</div>;
  // }
    
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
      <div className="mb-3">
        <a
          href={url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-lg text-zinc-50 hover:text-zinc-600 cursor-pointer'
        >
          {title}
        </a>
        <p className='text-sm text-zinc-400 mb-3'>{domain}</p>
      </div>
      <hr className='border-zinc-700 dark:border-zinc-800 h-[2px]' />
    </>
  );
};

export default JobCard
