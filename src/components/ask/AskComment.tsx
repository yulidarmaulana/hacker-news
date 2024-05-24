import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Skeleton from '../ui/Skeleton';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import { TrendingUp, MessageSquareMore } from 'lucide-react';

interface HackerNewsComment {
    by: string;
    id: number;
    time: number;
    type: string;
    text: string | null;
    score: number;
    parent: number | null;
    kids?: HackerNewsComment[];
    deleted?: true;
}

const AskComment = () => {
    const { id } = useParams<{ id: string }>();
    const [story, setStory] = useState<HackerNewsComment | null>(null);
    const [comments, setComments] = useState<HackerNewsComment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedComments, setExpandedComments] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const storyResponse = await axios.get<HackerNewsComment>(
                    `https://hacker-news.firebaseio.com/v0/item/${id}.json`
                );
                setStory(storyResponse.data);
                setLoading(false);

                if (storyResponse.data.kids) {
                    const promises = storyResponse.data.kids.map(async commentId => {
                        try {
                            const commentResponse = await axios.get<HackerNewsComment>(
                                `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
                            );
                            return commentResponse.data;
                        } catch (error) {
                            console.error(`Failed to fetch comment with ID ${commentId}`);
                            return null;
                        }
                    });

                    const commentsData = await Promise.all(promises);
                    setComments(
                        commentsData.filter(
                            comment => comment !== null
                        ) as HackerNewsComment[]
                    );
                }
            } catch (error) {
                setError('Failed to fetch story');
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const toggleExpandComment = (commentId: number) => {
        if (expandedComments.includes(commentId)) {
            setExpandedComments(expandedComments.filter(id => id !== commentId));
        } else {
            setExpandedComments([...expandedComments, commentId]);
        }
    };

    const isCommentExpanded = (commentId: number) => {
        return expandedComments.includes(commentId);
    };

    const shouldShowReadMore = (comment: HackerNewsComment) => {
        return comment.text && comment.text.length >= 1000;
    };

    const renderComments = (comments: HackerNewsComment[]) => {
        return comments.map(comment => (
            <div key={comment.id} className=''>
                <div className='my-2'>
                    <div className='flex items-baseline gap-2'>
                        <p className='mt-2 text-sm text-zinc-400'>
                            {comment.by ?? 'unknow'}
                        </p>
                        <p className='text-sm text-zinc-500'>
                            {dayjs.unix(comment.time).fromNow()}
                        </p>
                    </div>
                    <div
                        className={`my-2 text-zinc-300 ${isCommentExpanded(comment.id) ? '' : 'max-h-[100px] overflow-hidden'}`}
                        dangerouslySetInnerHTML={{ __html: comment.text ?? '' }}
                    />
                    {shouldShowReadMore(comment) && (
                        <button
                            className='text-blue-500 hover:text-blue-50'
                            onClick={() => toggleExpandComment(comment.id)}
                        >
                            {isCommentExpanded(comment.id) ? ' less' : ' more'}
                        </button>
                    )}
                </div>
                <div className='mb-3 flex gap-6'>
                    {comment.score && (
                        <p className='flex gap-1 text-sm text-zinc-400'>
                            <TrendingUp className='h-4 w-4 self-center' />{' '}
                            {comment.score}{' '}
                        </p>
                    )}
                    {comment.kids && (
                        <div className='flex gap-1 text-sm text-zinc-400'>
                            <MessageSquareMore className='h-4 w-4 self-center' />{' '}
                            {comment.kids.length ?? 0}{' '}
                            <button
                                className='text-blue-500 hover:text-blue-50'
                                onClick={() => toggleExpandComment(comment.id)}
                            >
                                {isCommentExpanded(comment.id)
                                    ? 'Hide Replies'
                                    : 'Show Replies'}
                            </button>
                        </div>
                    )}
                </div>
                <hr className='h-[2px] border-zinc-700 dark:border-zinc-800' />

                {isCommentExpanded(comment.id) && comment.kids && (
                    <div className='border-l-2 border-zinc-500 pl-8'>
                        {renderComments(comment.kids)}
                    </div>
                )}
            </div>
        ));
    };

    if (loading) {
        return (
            <div className='flex h-screen overflow-hidden bg-zinc-800'>
                <div className='flex flex-1 flex-col'>
                    <div className='flex-1 gap-2 overflow-y-auto px-4 py-4'>
                        <Skeleton />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !story) {
        return (
            <div className='flex h-screen overflow-hidden'>
                <div className='flex-1 overflow-y-auto px-4 py-4'>
                    <div className='flex h-full items-center justify-center'>
                        <p>Error...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className='flex-1 overflow-y-auto'>
                <div className='pb-20 md:pb-2 lg:pb-2'>
                    {renderComments(comments)}
                </div>
            </div>
        </>
    );
};

export default AskComment;
