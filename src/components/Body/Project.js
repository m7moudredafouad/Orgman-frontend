import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Import Helpers
import { LoginContext } from '../../shared/context/LoginContext';

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
	const { token } = useContext(LoginContext);
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
	const [errorState, setErrorState] = useState(null);

	// For The every change of id
	useEffect(() => {
		getProjectTasks(projectId, token);
	}, [projectId, token]);

	// Get The Project
	const getProjectTasks = (id, token) => {
		fetch(`${process.env.REACT_APP_API_URL}/projects/${id}`, {
			headers: {
				Authorization: token,
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				// console.log('[PROJECT REQUEST] Success: ', data.success);
				if (!data.success) {
					return setErrorState(data.message);

					// throw new Error(data.message);
				}
				setTitleState(data.task.title);
				setIdState(data.task._id);
				// setDoneState(data.task.done);
				setSubTasksState(data.task.subTasks);
			})
			.catch((err) => {
				setErrorState(err);
				// console.log(err);
			});
	};

	const removeError = () => {
		setErrorState(null);
		window.location.replace('/');
	};

	// Creating Functions
	const createTask = (title, done) => {
		if (!title) {
			setCreateModalState(false);
			return;
		}

		let newTask = {
			_id: new Date().getTime(),
			done,
			title,
			subTasks: [],
			isNew: true,
		};

		setSubTasksState([...subTasksState, newTask]);

		addToCreates(idState, newTask, false);
		setCreateModalState(false);
	};

	// Editing Functions
	const EditModalVisibility = (state) => {
		setEditModalState(state);
	};

	const SaveEdits = (title, done) => {
		// Save the new updates to the context with the id
		// console.log(title, done);
		if (!title || (titleState === title && doneState === done)) {
			EditModalVisibility(false);
			return;
		}
		setTitleState(title);
		setDoneState(done);
		addToUpdates(idState, { title, done });
		EditModalVisibility(false);
	};

	// Delete Functions
	const deleteChildFromSubTasks = (id) => {
		setSubTasksState(deleteSubTasks(subTasksState, id));
	};

	const deleteProject = () => {
		setLoading(true);
		deleteRequest([projectId], token, projectId)
			.then((data) => {
				if (data.success) {
					setLoading(false);
					return window.location.assign('/');
				}
				throw new Error('Project deletion error');
			})
			.catch((err) => {
				setErrorState(err);
				// console.log(err);
			});
	};

	// Render Function
	const renderTasks = () => {
		if (!subTasksState) return null;

		return subTasksState.map((subTask) => {
			return (
				<Task
					key={subTask._id}
					projectId={idState}
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

			{errorState ? (
				<Modal
					type="msg"
					header="Error"
					msg={errorState}
					onClose={removeError}
				/>
			) : null}

			{createModalState && (
				<Modal
					type="form"
					header="Create Task"
					value=""
					checked={false}
					onClose={() => setCreateModalState(false)}
					onSave={createTask}
				/>
			)}

			{editModalState && (
				<Modal
					type="form"
					header={`Edit ${titleState}`}
					value={titleState}
					checked={doneState}
					onClose={() => EditModalVisibility(false)}
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
						<button
							className="btn p-0 pl-1"
							onClick={() => EditModalVisibility(true)}
						>
							<SVG name="edit" />
						</button>
						<button
							className="btn p-0 pl-1"
							onClick={() => save(token, idState)}
						>
							<SVG name="save" />
						</button>
						<button
							className="btn p-0 pl-1"
							onClick={() => setCreateModalState(true)}
						>
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
