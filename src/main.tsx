import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import Root from './routes/root'
import Error from './routes/error'
import Story from './pages/Story'
import Ask from './pages/Ask'
import Job from './pages/Job'
import Show from './pages/Show'
import StoryDetail from './components/story/StoryDetail'
import AskDetail from './components/ask/AskDetail'
import JobDetail from './components/job/JobDetail'
import ShowDetail from './components/show/ShowDetail'
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Story />,
		errorElement: <Error />
	},
	{
		path: 'story/:id',
		element: <StoryDetail />
	},
	{
		path: 'ask',
		element: <Ask />,
		errorElement: <Error />
	},
	{
		path: 'ask/:id',
		element: <AskDetail />
	},
	{
		path: 'job',
		element: <Job />,
		errorElement: <Error />
	},
  {
		path: 'job/:id',
		element: <JobDetail />
	},
	{
		path: 'show',
		element: <Show />,
		errorElement: <Error />
	}, 
  {
    path: 'show/:id',
    element: <ShowDetail />,
    errorElement: <Error />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={new QueryClient()} >
			<RouterProvider router={router} />
    </QueryClientProvider>
	</React.StrictMode>
)
