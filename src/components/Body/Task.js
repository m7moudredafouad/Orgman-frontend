import React, { Fragment, useContext, useState } from 'react';

// Import Helpers
import { ProjectContext } from '../../shared/context/ProjectContext';

// Import Components
import Actions from '../../shared/helpers/actions';
import SVG from './../../shared/SVG';
import SubTask from './SubTask';
import Modal from '../../shared/Modal/Modal';

const Tasks = ({
	id,
	title,
	done,
	subTasks,
	prevNodes,
	isNew,
	deleteMeFromParent,
}) => {
	// Context
	const { addToUpdates, addToCreates } = useContext(ProjectContext);
	const [deleteSubTasks] = Actions();

	// Task States
	const [titleState, setTitleState] = useState(title);
	const [doneState, setDoneState] = useState(done);
	const [subTasksState, setSubTasksState] = useState(subTasks || []);

	// Other States
	const [editModalState, setEditModalState] = useState(false);
	const [createModalState, setCreateModalState] = useState(false);
	const [showSubTasks, setShowSubTasks] = useState(false);

	const getSubTasks = (otherTasks = []) => {
		if (isNew || (subTasksState && subTasksState.length > 0)) {
			return setShowSubTasks((prevState) => !prevState);
		}

		fetch(`${process.env.REACT_APP_API_URL}/tasks/${id}`)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log('[SUBTASKS REQUEST]', data);
				if (!data.success) {
					console.log('Task Not Found');
				}
				otherTasks.length > 0
					? setSubTasksState([...data.task.subTasks, ...otherTasks])
					: setSubTasksState(data.task.subTasks);

				setShowSubTasks(true);
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
		if (!isNew && subTasksState.length <= 0) {
			getSubTasks([newTask]);
		} else {
			setSubTasksState([...subTasksState, newTask]);
			setShowSubTasks(true);
		}

		addToCreates(id, newTask, isNew);
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
		addToUpdates(id, { title, done }, isNew);
		hideEditModal();
	};

	// Deleting Functions
	const deleteChildFromSubTasks = (id) => {
		setSubTasksState(deleteSubTasks(subTasksState, id));
	};

	return (
		<Fragment>
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

						<button className="btn p-0" onClick={showEditModal}>
							<SVG name="edit" />
						</button>

						{prevNodes >= 4 ? null : (
							<Fragment>
								<button className="btn p-0" onClick={showCreateModal}>
									<SVG name="plus" />
								</button>

								{showSubTasks && subTasksState.length <= 0 ? null : (
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
					/>
				)}
			</div>
		</Fragment>
	);
};

export default Tasks;
