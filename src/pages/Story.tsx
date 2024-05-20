import { FC, useEffect, useState } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import StoryButton from '../components/story/StoryButton'
import StoryCard from '../components/story/StoryCard'

import { Link } from 'react-router-dom'
import { storyService } from '../service/StoryService'
import Skeleton from '../components/ui/Skeleton'

interface Story {
	id: number
	title: string
	url: string
	by: string
	time: number
}


const Story: FC = () => {
	const [stories, setStories] = useState<Story[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)
	const [lastClickedButton, setLastClickedButton] = useState('');


	useEffect(() => {
		const fetchTopStories = async () => {
				try {
						setLoading(true);
						const data = await storyService('topstories'); // Menggunakan fetchStories untuk mengambil data top stories
						setStories(data);
						setLoading(false);
				} catch (err) {
						setError('Failed to fetch top stories');
						setLoading(false);
				}
		};

		fetchTopStories();
}, []);


const fetchStoriesByType = async (type: 'top' | 'new' | 'best') => {
	try {
			setLoading(true);
			let url;
			switch (type) {
					case 'top':
							url = 'https://hacker-news.firebaseio.com/v0/topstories.json';
							break;
					case 'new':
							url = 'https://hacker-news.firebaseio.com/v0/newstories.json';
							break;
					case 'best':
							url = 'https://hacker-news.firebaseio.com/v0/beststories.json';
							break;
					default:
							throw new Error('Invalid story type');
			}

			const storiesResponse = await axios.get<number[]>(url);
			const storyPromises = storiesResponse.data
					.slice(0, 20)
					.map(storyId =>
							axios.get<Story>(
									`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
							)
					);
			const storiesData = await Promise.all(storyPromises);
			const newData = storiesData.map(response => response.data);

			// Simpan data ke local storage
			localStorage.setItem(`${type}Stories`, JSON.stringify(newData));
			localStorage.setItem(`${type}Stories_expiration`, Date.now().toString());

			setStories(newData);
			setLoading(false);
	} catch (err) {
			setError(`Failed to fetch ${type} stories`);
			setLoading(false);
	}

	setLastClickedButton(type);
};


	if (loading) {
		return (
			<div className='flex h-screen overflow-hidden bg-zinc-800'>
				<Sidebar />
				<div className='flex flex-1 flex-col'>
					<Navbar />

					<hr className='h-[2px] border-zinc-700 dark:border-zinc-800' />
					<div className='flex gap-2 p-2'>
						<StoryButton
							text='Top'
							onClick={() => fetchStoriesByType('top')}
							isLastClicked={lastClickedButton === 'top'}
						/>
						<StoryButton
							text='New'
							onClick={() => fetchStoriesByType('new')}
							isLastClicked={lastClickedButton === 'new'}
						/>
						<StoryButton
							text='Best'
							onClick={() => fetchStoriesByType('best')}
							isLastClicked={lastClickedButton === 'best'}
						/>
					</div>
					<hr className='h-[2px] border-zinc-700 dark:border-zinc-800' />

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
		<div className='flex h-screen overflow-hidden bg-zinc-800'>
			<Sidebar />
			<div className='flex flex-1 flex-col'>
				<Navbar />

				<hr className='border-zinc-700 dark:border-zinc-800 h-[2px]' />
				<div className='flex gap-2 p-2'>
            <StoryButton text='Top' onClick={() => fetchStoriesByType('top')} isLastClicked={lastClickedButton === 'top'} />
            <StoryButton text='New' onClick={() => fetchStoriesByType('new')} isLastClicked={lastClickedButton === 'new'} />
            <StoryButton text='Best' onClick={() => fetchStoriesByType('best')} isLastClicked={lastClickedButton === 'best'} />
        </div>
				<hr className='border-zinc-700 dark:border-zinc-800 h-[2px]' />


				<div className='flex-1 overflow-y-auto px-4 py-4 pb-16 md:pb-2 lg:pb-2'>
					<ul className='flex flex-col'>
						{stories.map(story => (
							<li key={story.id} className='bg-zinc-800 p-3 py-2'>
								<a
									href={story.url}
									target='_blank'
									rel='noopener noreferrer'
									className='text-lg text-zinc-50 hover:text-zinc-600'
								>
									<Link to={`/story/${story.id}`}>
										<StoryCard {...story} />
									</Link>
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}

export default Story
