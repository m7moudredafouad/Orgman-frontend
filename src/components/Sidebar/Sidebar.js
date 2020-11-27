import React, { Fragment, useContext, useEffect, useState } from 'react';

import { LoginContext } from '../../shared/context/LoginContext';

import Modal from '../../shared/Modal/Modal';
import SVG from '../../shared/SVG';
import Projects from './Projects';
import Spinner from '../../shared/Modal/Spinner';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	const { token, logout } = useContext(LoginContext);
	const [projectsState, setProjectsState] = useState([]);
	const [createModalState, setCreateModalState] = useState(false);
	const [createProjectLoading, setCreateProjectLoading] = useState(false);

	useEffect(() => {
		getAllProjects(token);
	}, [token]);

	const getAllProjects = (token) => {
		setCreateProjectLoading(true);

		fetch(`${process.env.REACT_APP_API_URL}/projects`, {
			headers: {
				Authorization: token,
			},
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				// console.log('[ALL PROJECTS REQUEST] Success: ', data.success);
				if (!data.success) {
					return logout();
				}
				setProjectsState(data.tasks);
				setCreateProjectLoading(false);
			});
	};

	const createNewProject = (task) => {
		return new Promise((resolve, reject) => {
			setCreateProjectLoading(true);
			fetch(`${process.env.REACT_APP_API_URL}/projects`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: token,
				},
				body: JSON.stringify(task),
			})
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					if (!data.success) {
						return logout();
					}
					resolve(data);
					setCreateProjectLoading(false);
				})
				.catch((err) => {
					reject(err);
				});
		});
	};

	// Creating Functions
	const showCreateModal = () => {
		setCreateModalState(true);
	};

	const hideCreateModal = () => {
		setCreateModalState(false);
	};

	const createProject = (title, done) => {
		createNewProject({ title, done }).then((data) => {
			// console.log('[CREATE PROJECT] Success: ', data.success);
			if (!data.success) {
				throw new Error(data.message);
			}
			setProjectsState([...projectsState, data.task]);
			hideCreateModal();
		});
	};

	return (
		<Fragment>
			{createProjectLoading && <Spinner />}

			{createModalState && (
				<Modal
					type="form"
					header="Create Project"
					value=""
					checked={false}
					onClose={hideCreateModal}
					onSave={createProject}
				/>
			)}

			<div className="projects">
				<div className="projects__top">
					<div className="projects__top-logo">
						<a href="/">
							Org<span>man</span>
						</a>
					</div>
					<button
						className="btn btn-dark projects__top-add"
						onClick={showCreateModal}
					>
						Add project
					</button>
				</div>

				<Projects projects={projectsState} />

				<ul className="projects__end">
					<Link to="/" className="projects__end-links">
						<SVG name="settings" />
					</Link>
					<button className="btn projects__end-links" onClick={logout}>
						<SVG name="logout" />
					</button>
				</ul>
			</div>
		</Fragment>
	);
};

export default Sidebar;
