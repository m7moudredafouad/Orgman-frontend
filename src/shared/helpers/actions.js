import { useContext } from 'react';

import { ProjectContext } from '../context/ProjectContext';

const Actions = () => {
	const { addToDeletes, addToUpdates } = useContext(ProjectContext);

	const deleteSubTasks = (subTaskArray, id) => {
		addToDeletes(id);
		addToUpdates(id, undefined);
		// console.log('DELETE Task');
		return subTaskArray.filter((task) => task._id !== id);
	};

	return [deleteSubTasks];
};

export default Actions;
