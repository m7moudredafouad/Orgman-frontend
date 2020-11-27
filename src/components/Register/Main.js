import React from 'react';

import MainShow from './MainShow';
import Register from './Register';

const Main = () => {
	return (
		<div className="main">
			<MainShow />
			<Register />
			<div className="main__copy">
				&copy; 2020 - Orgman by{' '}
				<a
					href="https://m7moud.web.app/"
					target="_blank"
					rel="noopener noreferrer"
				>
					M7moud
				</a>
			</div>
		</div>
	);
};

export default Main;
