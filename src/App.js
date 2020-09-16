import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { ProjectProvider } from './shared/context/ProjectContext';

import Sidebar from './components/Sidebar/Sidebar';
import NoTasks from './components/Body/NoTasks';
import Project from './components/Body/Project';

function App() {
	return (
		<div className="container__projects">
			<BrowserRouter>
				<Sidebar />
				<Switch>
					<Route path="/:projectId">
						<ProjectProvider>
							<Project />
						</ProjectProvider>
					</Route>
					<Route path="/">
						<NoTasks />
					</Route>
				</Switch>
			</BrowserRouter>
		</div>
	);
}

export default App;
