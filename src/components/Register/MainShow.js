import React from 'react';

import SVG from '../../shared/SVG';

const MainShow = () => {
	return (
		<div className="main__show">
			<SVG name="tasks" />
			<div className="main__show-msg">
				Manage your projects easily with Proman
			</div>
		</div>
	);
};

export default MainShow;
