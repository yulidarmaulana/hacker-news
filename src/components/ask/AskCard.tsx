import { MessageSquareMore, TrendingUp } from 'lucide-react';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

interface AskCardProps {
  id: number
	by: string
	time: number
	url: string
  kids?: number[]
  score?: number[]
  title: string
  text: string
}

const AskCard = ({ title, by, time, url, kids, score}: AskCardProps) => {

	return (
		<>
			<div className='flex items-stretch gap-2'>
				<p className='text-sm text-zinc-900 dark:text-zinc-400'>{by}</p>
        
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
				className='text-lg text-zinc-900 dark:text-zinc-100 hover:text-zinc-600'
        >
				{title}
			</a>
				{/* <p className='text-sm text-zinc-400' id='desc' dangerouslySetInnerHTML={{__html: text}}></p> */}
        </div>
      <div className="mb-3 flex gap-6">
        {score && <p className="text-sm text-zinc-400 flex gap-1"><TrendingUp className="w-4 h-4 self-center" /> {score} </p>}
        {kids && <p className="text-sm text-zinc-400 flex gap-1 "><MessageSquareMore className="w-4 h-4 self-center" />  {kids.length ?? 0} </p>}
      </div>
      <hr className='border-zinc-700 dark:border-zinc-600 h-[2px]' />
		</>
	)
}

export default AskCard
