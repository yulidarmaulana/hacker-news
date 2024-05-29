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

    const toggleExpandReplies = async (commentId: number) => {
        const comment = comments.find(comment => comment.id === commentId);
        
        if (comment && comment.kids) {
            const promises = comment.kids.map(async kidId => {
                // Ensure kidId is a number
                const id = typeof kidId === 'object' ? kidId.id : kidId;
                if (typeof id !== 'number') {
                    console.error(`Invalid kidId: ${id}`);
                    return null;
                }
                try {
                    const kidResponse = await axios.get<HackerNewsComment>(
                        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
                    );
                    return kidResponse.data;
                } catch (error) {
                    console.error(`Failed to fetch comment with ID ${id}`);
                    return null;
                }
            });
    
            const kidsData = await Promise.all(promises);
    
            // Update only the comment that is being expanded or collapsed
            setComments(prevComments => {
                return prevComments.map(prevComment => {
                    if (prevComment.id === commentId) {
                        return {
                            ...prevComment,
                            kids: kidsData.filter(kid => kid !== null) as HackerNewsComment[]
                        };
                    }
                    return prevComment;
                });
            });
    
            // Update expandedComments state based on whether the comment is being expanded or collapsed
            setExpandedComments(prevExpandedComments => {
                const isCurrentlyExpanded = isCommentExpanded(commentId);
                if (isCurrentlyExpanded) {
                    // If the comment is currently expanded, collapse it
                    return prevExpandedComments.filter(id => id !== commentId);
                } else {
                    // If the comment is not expanded, expand it
                    return [...prevExpandedComments, commentId];
                }
            });
        }
    };
    
    
    const isCommentExpanded = (commentId: number) => {
        return expandedComments.includes(commentId);
    };

    const shouldShowReadMore = (comment: HackerNewsComment) => {
        return comment.text && comment.text.length >= 1000;
    };

    const renderCommentActions = (comment: HackerNewsComment) => {
        return (
            <div className='mb-3 flex gap-6'>
                {comment.score && (
                    <p className='flex gap-1 text-sm text-zinc-400'>
                        <TrendingUp className='h-4 w-4 self-center' /> {comment.score}{' '}
                    </p>
                )}
                {comment.kids && (
                    <div className='flex gap-1 text-sm text-zinc-400'>
                        <MessageSquareMore className='h-4 w-4 self-center' />{' '}
                        {comment.kids.length ?? 0}{' '}
                        <button
                            className='text-blue-500 hover:text-blue-700'
                            onClick={() => toggleExpandReplies(comment.id)}
                        >
                            {isCommentExpanded(comment.id) ? 'Hide' : 'Replies'}
                        </button>
                    </div>
                )}
            </div>
        );
    };

    const getCommentText = (comment: HackerNewsComment) => {
        if (isCommentExpanded(comment.id) || !shouldShowReadMore(comment)) {
            return comment.text ?? '';
        } else {
            return comment.text?.slice(0, 1000) ?? '';
        }
    };
    const renderComment = (comment: HackerNewsComment) => (
        <div key={comment.id} className=''>
            <div className='my-2'>
                <div className='flex items-baseline gap-2'>
                    <p className='mt-2 text-sm text-zinc-400'>
                        {comment.by ?? 'unknown'}
                    </p>
                    <p className='text-sm text-zinc-500'>
                        {dayjs.unix(comment.time).fromNow()}
                    </p>
                </div>
                <div
                    className={`my-2 text-zinc-700 dark:text-zinc-100 ${isCommentExpanded(comment.id) ? '' : 'max-h-[100px] overflow-hidden'}`}
                    dangerouslySetInnerHTML={{ __html: getCommentText(comment) }}
                />
                {shouldShowReadMore(comment) && (
                    <button
                        className='text-blue-500 hover:text-blue-700'
                        onClick={() => toggleExpandComment(comment.id)}
                    >
                        {isCommentExpanded(comment.id) ? ' less' : ' more'}
                    </button>
                )}
            </div>
            {renderCommentActions(comment)}
    
            <hr className='h-[2px] border-zinc-700 dark:border-zinc-600' />
            
            {isCommentExpanded(comment.id) && comment.kids && (
                <div className='border-l-2 border-zinc-500 pl-8'>
                    {/* Panggil renderComments untuk menangani komentar-komentar anak */}
                    {renderComments(comment.kids as HackerNewsComment[])}
                </div>
            )}
        </div>
    );
    
    const renderComments = (comments: HackerNewsComment[]) => (
        <>
            {comments.map(comment => renderComment(comment))}
        </>
    );    
    

    if (loading) {
        return (
            <div className='flex h-screen overflow-hidden dark:bg-zinc-800 bg-mystic-300'>
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
                    {renderComments(comments as HackerNewsComment[])}
                </div>
            </div>
        </>
    );
};

export default AskComment;
