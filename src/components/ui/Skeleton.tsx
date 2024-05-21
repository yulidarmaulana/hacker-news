const Skeleton = () => {
	return (
		<>
			<div className='skeleton-card rounded bg-zinc-800'>
				<div className='skeleton-text mb-2 h-4 w-28 animate-pulse rounded-lg bg-zinc-700'></div>
				<div className='skeleton-text mb-2 h-12 w-full animate-pulse rounded-lg bg-zinc-700'></div>
				<div className='skeleton-line mb-2 h-4 w-12 animate-pulse rounded-lg bg-zinc-700'></div>
			</div>
		</>
	)
}

export default Skeleton
