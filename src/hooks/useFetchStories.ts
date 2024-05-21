import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

import { StoryTypesInterface } from '../types/story';


const useFetchStories = (apiUrl: string) => {
  const fetchStory = async ({ pageParam = 0 }) => {
    const stories = await axios.get<number[]>(`${apiUrl}/topstories.json`);
    const jobPromises = stories.data
      .slice(pageParam, pageParam + 20)
      .map((showId: number) =>
        axios.get<StoryTypesInterface>(`${apiUrl}/item/${showId}.json`)
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
    queryKey: ['stories', apiUrl],
    queryFn: fetchStory,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  });

  return { data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, status };
};

export default useFetchStories;
