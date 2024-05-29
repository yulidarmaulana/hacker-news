const Skeleton = () => {
	return (
		<>
			<div className='skeleton-card rounded dark:bg-zinc-800 bg-mystic-300'>
				<div className='skeleton-text mb-2 h-4 w-28 animate-pulse rounded-lg dark:bg-zinc-700 bg-mystic-400'></div>
				<div className='skeleton-text mb-2 h-12 w-full animate-pulse rounded-lg dark:bg-zinc-700 bg-mystic-400'></div>
				<div className='skeleton-line mb-2 h-4 w-12 animate-pulse rounded-lg dark:bg-zinc-700 bg-mystic-400'></div>
			</div>
		</>
	)
}

export default Skeleton
