import React from 'react';

import SVG from '../../shared/SVG';

const NoTasks = () => {
	return (
		<div className="tasks">
			<div className="tasks__noTasks">
				<SVG name="tasks"></SVG>
				<div className="tasks__noTasks-msg">
					Manage your projects easily with Orgman
				</div>
			</div>
		</div>
	);
};

export default NoTasks;
