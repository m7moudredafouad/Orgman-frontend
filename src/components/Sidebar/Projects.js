import React, { useEffect, useState } from 'react';

const Sidebar = () => {
	const [projectsState, setProjectsState] = useState([]);

	useEffect(() => {
		getAllProjects();
	}, []);

	const getAllProjects = () => {
		fetch(`${process.env.REACT_APP_API_URL}/projects`)
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				console.log('[ALL PROJECTS REQUEST] Success: ', data.success);
				if (!data.success) {
					throw new Error(data.message);
				}
				setProjectsState(data.tasks);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const renderProjects = () => {
		if (projectsState.length <= 0) return null;
		return projectsState.map((project) => {
			return (
				<a
					href={`./${project._id}`}
					key={project._id}
					className="projects__middle-list--item"
				>
					<li>{project.title}</li>
				</a>
			);
		});
	};

	return (
		<div className="projects__middle">
			<ul className="projects__middle-list">{renderProjects()}</ul>
		</div>
	);
};

export default Sidebar;
