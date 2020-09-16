import React from 'react';

import Task from './Task';

const SubTasks = ({ tasks, show, prevNodes, deleteMeFromParent }) => {
	const style = {
		hide: {
			display: 'none',
		},
		show: {
			display: 'inherit',
		},
	};
	return (
		<div className="task__subTasks" style={show ? style.show : style.hide}>
			{tasks.map((subTask) => (
				<Task
					key={subTask._id}
					id={subTask._id}
					prevNodes={prevNodes}
					title={subTask.title}
					done={subTask.done}
					subTasks={subTask.subTasks}
					isNew={subTask.isNew}
					deleteMeFromParent={deleteMeFromParent}
				/>
			))}
		</div>
	);
};

export default SubTasks;
