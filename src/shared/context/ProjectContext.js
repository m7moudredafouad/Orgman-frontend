import React, { useReducer } from 'react';

import {
	deleteRequest,
	CreateRequest,
	UpdateRequest,
} from '../helpers/request';

export const ProjectContext = React.createContext();

const reducer = (state, action) => {
	let virtualState = { ...state };

	switch (action.type) {
		case 'CREATE_TO_PARENT':
			let parentTask = virtualState.creation[action.payload._id];
			if (!parentTask) {
				virtualState.creation[action.payload._id] = [action.payload.task._id];
			} else {
				parentTask.push(action.payload.task._id);
			}
			return virtualState;

		case 'CREATE_TO_NEW':
			const parentNewTask = virtualState.creation[action.payload._id].subTasks;
			parentNewTask.push(action.payload.task._id);
			return virtualState;

		case 'CREATE':
			virtualState.creation[action.payload._id] = {
				title: action.payload.task.title,
				done: action.payload.task.done,
				subTasks: action.payload.task.subTasks,
			};
			return virtualState;

		case 'UPDATE_NEW':
			virtualState.creation[action.payload._id] = {
				...virtualState.creation[action.payload._id],
				...action.payload.task,
			};
			return virtualState;

		case 'UPDATE':
			// If we deleted the task we should remove it from updates if any
			if (typeof action.payload.task === 'undefined') {
				delete virtualState.updates[action.payload._id];
			} else {
				virtualState.updates[action.payload._id] = {
					...action.payload.task,
				};
			}
			return virtualState;

		case 'DELETE':
			virtualState.deletes.push(action.payload.id);
			return virtualState;

		case 'LOADING':
			return {
				...state,
				loading: action.payload.loading,
			};
		default:
			return state;
	}
};

export const ProjectProvider = (props) => {
	const [projectState, dispatch] = useReducer(reducer, {
		loading: false,
		creation: {},
		updates: {},
		deletes: [],
	});

	const addToDeletes = (id) => {
		dispatch({ type: 'DELETE', payload: { id } });
	};

	const addToUpdates = (_id, task, isNew) => {
		if (_id === null) return;
		if (isNew) {
			dispatch({ type: 'UPDATE_NEW', payload: { _id, task } });
		} else {
			dispatch({ type: 'UPDATE', payload: { _id, task } });
		}
	};

	const addToCreates = (_id, task, isParentNew) => {
		if (!isParentNew) {
			dispatch({ type: 'CREATE_TO_PARENT', payload: { _id, task } });
		} else {
			dispatch({ type: 'CREATE_TO_NEW', payload: { _id, task } });
		}

		dispatch({ type: 'CREATE', payload: { _id: task._id, task } });
	};

	const convertCreation = () => {
		let creation = { ...projectState.creation };
		const keys = Object.keys(creation).reverse();

		keys.forEach((id) => {
			let task = creation[id];

			if (task.subTasks) {
				if (task.subTasks.length <= 0) return;

				let subTasks = [...task.subTasks];
				task.subTasks = subTasks.map((el) => {
					let subTask = { ...creation[el] };
					delete creation[el];
					return subTask;
				});
			} else {
				console.log('HAHA');
				let subTasks = [...task];
				task = [].concat(
					subTasks.map((el) => {
						let subTask = { ...creation[el] };
						delete creation[el];
						console.log(subTask);
						return subTask;
					})
				);
			}

			creation = {
				...creation,
				[id]: task,
			};
		});

		console.log(creation);

		return creation;
	};

	const setLoading = (loading) => {
		dispatch({ type: 'LOADING', payload: { loading } });
	};

	const save = () => {
		dispatch({ type: 'LOADING', payload: { loading: true } });
		let requests = [];
		if (projectState.deletes.length > 0) {
			requests.push(deleteRequest(projectState.deletes));
		}

		if (Object.keys(projectState.updates).length > 0) {
			requests.push(UpdateRequest(projectState.updates));
		}

		if (Object.keys(projectState.creation).length > 0) {
			const newTasks = convertCreation();
			requests.push(CreateRequest(newTasks));
		}

		Promise.all(requests)
			.then((data) => {
				console.log(data);
				dispatch({ type: 'LOADING', payload: { loading: false } });
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<ProjectContext.Provider
			value={{
				loading: projectState.loading,
				setLoading,
				addToDeletes,
				addToUpdates,
				addToCreates,
				save,
			}}
		>
			{props.children}
		</ProjectContext.Provider>
	);
};
