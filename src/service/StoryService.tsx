import axios from 'axios';

interface Story {
    id: number;
    title: string;
    url: string;
    by: string;
    time: number;
}

const CACHE_EXPIRATION_TIME = 600000;

const storyService = async (endpoint: string): Promise<Story[]> => {
    
    try {
        const cachedData = localStorage.getItem(endpoint);
        const cacheExpiration = localStorage.getItem(`${endpoint}_expiration`);

        if (cachedData && cacheExpiration && Date.now() - parseInt(cacheExpiration) < CACHE_EXPIRATION_TIME) {
            return JSON.parse(cachedData);
        } else {
            const response = await axios.get<number[]>(`https://hacker-news.firebaseio.com/v0/${endpoint}.json`);
            const storyPromises = response.data
                .slice(0, 20)
                .map(storyId =>
                    axios.get<Story>(
                        `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
                    )
                );
            const storiesData = await Promise.all(storyPromises);
            const newData = storiesData.map(response => response.data);

            localStorage.setItem(endpoint, JSON.stringify(newData));
            localStorage.setItem(`${endpoint}_expiration`, Date.now().toString());

            return newData;
        }
    } catch (error) {
        throw new Error(`Failed to fetch ${endpoint} stories`);
    }
};

export { storyService };