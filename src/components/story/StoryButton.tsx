import { FC } from 'react';

const StoryButton: FC<{ text: string, onClick: () => void, isLastClicked: boolean }> = ({ text, onClick, isLastClicked }) => {
    const handleClick = async () => {
        await onClick(); // Panggil fungsi onClick yang diberikan sebagai prop
    };

    return (
        <button 
            className={`w-fit h-8 ${isLastClicked ? 'bg-zinc-900' : 'bg-zinc-700'} hover:bg-zinc-950 text-white px-4 font-medium rounded`}
            onClick={handleClick}
        >
            {text}
        </button>
    );
};

export default StoryButton;
