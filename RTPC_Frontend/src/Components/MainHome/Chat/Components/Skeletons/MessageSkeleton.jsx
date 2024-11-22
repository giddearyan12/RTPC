const MessageSkeleton = () => {
	return (
		<>
			<div className="skeleton-row">
				<div className="skeleton skeleton-avatar">hii</div>
				<div className="skeleton-column">
					<div className="skeleton skeleton-small"></div>
					<div className="skeleton skeleton-small"></div>
				</div>
			</div>
			<div className="skeleton-row skeleton-row-end">
				<div className="skeleton-column">
					<div className="skeleton skeleton-small"></div>
				</div>
				<div className="skeleton skeleton-avatar"></div>
			</div>
		</>
	);
};
export default MessageSkeleton;
