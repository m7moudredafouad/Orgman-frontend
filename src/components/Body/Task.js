import React, { Fragment, useContext, useState } from 'react';

// Import Helpers
import { LoginContext } from '../../shared/context/LoginContext';

import { ProjectContext } from '../../shared/context/ProjectContext';

// Import Components
import Actions from '../../shared/helpers/actions';
import SVG from './../../shared/SVG';
import SubTask from './SubTask';
import Modal from '../../shared/Modal/Modal';

const Tasks = ({
	id,
	title,
	projectId,
	done,
	subTasks,
	prevNodes,
	isNew,
	deleteMeFromParent,
}) => {
	// Context
	const { token } = useContext(LoginContext);
	const { addToUpdates, addToCreates } = useContext(ProjectContext);
	const [deleteSubTasks] = Actions();

	// Task States
	const [titleState, setTitleState] = useState(title);
	const [doneState, setDoneState] = useState(done);
	const [subTasksState, setSubTasksState] = useState(subTasks || []);

	// Other States
	const [loadingSubTasks, setLoadingSubTasks] = useState(false);
	const [editModalState, setEditModalState] = useState(false);
	const [createModalState, setCreateModalState] = useState(false);
	const [showSubTasks, setShowSubTasks] = useState(false);
	const [errorState, setErrorState] = useState(null);

	const getSubTasks = (otherTasks = []) => {
		if (isNew || (subTasksState && subTasksState.length > 0)) {
			return setShowSubTasks((prevState) => !prevState);
		}

		setLoadingSubTasks(true);
		fetch(
			`${process.env.REACT_APP_API_URL}/projects/${projectId}/tasks/${id}`,
			{
				headers: {
					Authorization: token,
				},
			}
		)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				// console.log('[SUBTASKS REQUEST]', data);
				if (!data.success) {
					return;
					// console.log('Task Not Found');
				}
				otherTasks.length > 0
					? setSubTasksState([...data.task.subTasks, ...otherTasks])
					: setSubTasksState(data.task.subTasks);

				setShowSubTasks(true);
				setLoadingSubTasks(false);
			})
			.catch((err) => {
				setErrorState(err);
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
		if (!isNew && subTasksState.length <= 0) {
			getSubTasks([newTask]);
		} else {
			setSubTasksState([...subTasksState, newTask]);
			setShowSubTasks(true);
		}

		addToCreates(id, newTask, isNew);
		setCreateModalState(false);
	};

	// Editing Functions
	const EditModalVisibility = (state) => {
		setEditModalState(state);
	};

	const SaveEdits = (title, done) => {
		// Save the new updates to the context with the id
		if (!title || (titleState === title && doneState === done)) {
			EditModalVisibility(false);
			return;
		}

		// console.log(title, done);
		setTitleState(title);
		setDoneState(done);
		addToUpdates(id, { title, done }, isNew);
		EditModalVisibility(false);
	};

	// Deleting Functions
	const deleteChildFromSubTasks = (id) => {
		setSubTasksState(deleteSubTasks(subTasksState, id));
	};

	return (
		<Fragment>
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

			<div className="task">
				<div className="task__info">
					<div className="task__info-data">
						<div className="task__info-done">
							{doneState && <div className="task__info-done--checked"></div>}
						</div>
						<p className="task__info-title">{titleState}</p>
					</div>

					<div>
						{!isNew && (
							<button
								className="btn p-0"
								onClick={() => deleteMeFromParent(id)}
							>
								<SVG name="trash" />
							</button>
						)}

						<button
							className="btn p-0"
							onClick={() => EditModalVisibility(true)}
						>
							<SVG name="edit" />
						</button>

						{prevNodes >= 4 ? null : (
							<Fragment>
								<button
									className="btn p-0"
									onClick={() => setCreateModalState(true)}
								>
									<SVG name="plus" />
								</button>

								{showSubTasks &&
								subTasksState.length <= 0 ? null : loadingSubTasks ? (
									<button className="btn p-0">
										<SVG name="spinner" className="spin" />
									</button>
								) : (
									<button className="btn p-0" onClick={getSubTasks}>
										<SVG name={showSubTasks ? 'up' : 'down'} />
									</button>
								)}
							</Fragment>
						)}
					</div>
				</div>

				{subTasksState && subTasksState.length > 0 && (
					<SubTask
						tasks={subTasksState}
						show={showSubTasks}
						prevNodes={prevNodes + 1}
						deleteMeFromParent={deleteChildFromSubTasks}
						projectId={projectId}
					/>
				)}
			</div>
		</Fragment>
	);
};

export default Tasks;
