import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Import Helpers
import { ProjectContext } from '../../shared/context/ProjectContext';
import { deleteRequest } from '../../shared/helpers/request';
import Actions from '../../shared/helpers/actions';

// Import Components
import Modal from '../../shared/Modal/Modal';
import Spinner from '../../shared/Modal/Spinner';

import SVG from '../../shared/SVG';
import Task from './Task';

const Project = () => {
	// Context
	const { projectId } = useParams();
	const { loading, setLoading, addToUpdates, addToCreates, save } = useContext(
		ProjectContext
	);

	// Task States
	const [doneState, setDoneState] = useState(false);
	const [idState, setIdState] = useState(null);
	const [titleState, setTitleState] = useState('');
	const [subTasksState, setSubTasksState] = useState([]);

	// Other States
	const [deleteSubTasks] = Actions();
	const [editModalState, setEditModalState] = useState(false);
	const [createModalState, setCreateModalState] = useState(false);

	// For The every change of id
	useEffect(() => {
		getProjectTasks(projectId);
	}, [projectId]);

	// Get The Project
	const getProjectTasks = (id) => {
		fetch(`${process.env.REACT_APP_API_URL}/projects/${id}`)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log('[PROJECT REQUEST] Success: ', data.success);
				if (!data.success) {
					throw new Error(data.message);
				}
				setTitleState(data.task.title);
				setIdState(data.task._id);
				// setDoneState(data.task.done);
				setSubTasksState(data.task.subTasks);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// Creating Functions
	const showCreateModal = () => {
		setCreateModalState(true);
	};

	const hideCreateModal = () => {
		setCreateModalState(false);
	};

	const createTask = (title, done) => {
		let newTask = {
			_id: new Date().getTime(),
			done,
			title,
			subTasks: [],
			isNew: true,
		};

		setSubTasksState([...subTasksState, newTask]);

		addToCreates(idState, newTask, false);
		hideCreateModal();
	};

	// Editing Functions
	const showEditModal = () => {
		setEditModalState(true);
	};

	const hideEditModal = () => {
		setEditModalState(false);
	};

	const SaveEdits = (title, done) => {
		// Save the new updates to the context with the id
		console.log(title, done);
		setTitleState(title);
		setDoneState(done);
		addToUpdates(idState, { title, done });
		hideEditModal();
	};

	// Delete Functions
	const deleteChildFromSubTasks = (id) => {
		setSubTasksState(deleteSubTasks(subTasksState, id));
	};

	const deleteProject = () => {
		setLoading(true);
		deleteRequest([projectId])
			.then((data) => {
				if (data.success) {
					setLoading(false);
					return window.location.assign('/');
				}
				throw new Error('Project deletion error');
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// Render Function
	const renderTasks = () => {
		if (!subTasksState) return null;

		return subTasksState.map((subTask) => {
			return (
				<Task
					key={subTask._id}
					id={subTask._id}
					title={subTask.title}
					done={subTask.done}
					prevNodes={1}
					subTasks={subTask.subTasks}
					isNew={subTask.isNew}
					deleteMeFromParent={deleteChildFromSubTasks}
				/>
			);
		});
	};

	return (
		<Fragment>
			{loading && <Spinner />}

			{createModalState && (
				<Modal
					type="form"
					header="Create Task"
					value=""
					checked={false}
					onClose={hideCreateModal}
					onSave={createTask}
				/>
			)}

			{editModalState && (
				<Modal
					type="form"
					header={`Edit ${titleState}`}
					value={titleState}
					checked={doneState}
					onClose={hideEditModal}
					onSave={SaveEdits}
				/>
			)}
			<div className="tasks">
				<div className="tasks__projectInfo">
					<p className="tasks__projectInfo-name">{titleState}</p>
					<div className="btn tasks__projectInfo-actions">
						<button className="btn p-0 pl-1" onClick={deleteProject}>
							<SVG name="trash" />
						</button>
						<button className="btn p-0 pl-1" onClick={showEditModal}>
							<SVG name="edit" />
						</button>
						<button className="btn p-0 pl-1" onClick={save}>
							<SVG name="save" />
						</button>
						<button className="btn p-0 pl-1" onClick={showCreateModal}>
							<SVG name="plus" />
						</button>
					</div>
				</div>

				<div className="tasks__container">{renderTasks()}</div>
			</div>
		</Fragment>
	);
};

export default Project;
