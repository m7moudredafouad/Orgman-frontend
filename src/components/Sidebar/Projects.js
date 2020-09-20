import React from 'react';

const Projects = ({ projects }) => {
	const renderProjects = () => {
		if (projects.length <= 0) return null;
		return projects.map((project) => {
			return (
				<a
					href={`/${project._id}`}
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

export default Projects;
