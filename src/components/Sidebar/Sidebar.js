import React from 'react';
import SVG from '../../shared/SVG';
import Projects from './Projects';
import { Link } from 'react-router-dom';

const Sidebar = () => {
	return (
		<div className="projects">
			<div className="projects__top">
				<div className="projects__top-logo">
					<a href="/">
						Pro<span>man</span>
					</a>
				</div>
				<button className="btn btn-dark projects__top-add">Add project</button>
			</div>

			<Projects />

			<ul className="projects__end">
				<Link to="/" className="projects__end-links">
					<SVG name="settings" />
				</Link>
				<Link to="/" className="projects__end-links">
					<SVG name="logout" />
				</Link>
			</ul>
		</div>
	);
};

export default Sidebar;
