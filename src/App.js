import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import { LoginContext } from './shared/context/LoginContext';
import { ProjectProvider } from './shared/context/ProjectContext';

import Main from './components/Register/Main';
import Sidebar from './components/Sidebar/Sidebar';
import NoTasks from './components/Body/NoTasks';
import Project from './components/Body/Project';

function App() {
	const { isLoggedIn } = useContext(LoginContext);

	return (
		<BrowserRouter>
			{isLoggedIn ? (
				<div className="container__projects">
					<Sidebar />
					<Switch>
						<Route path="/:projectId" exact>
							<ProjectProvider>
								<Project />
							</ProjectProvider>
						</Route>
						<Route path="*" exact>
							<NoTasks />
						</Route>
					</Switch>
				</div>
			) : (
				<Switch>
					<Route path="/" exact>
						<Main />
					</Route>
					<Route path="*">
						<div className="tasks">
							<div className="tasks__noTasks-msg">
								404{' '}
								<span role="img" aria-label="cry">
									😢
								</span>{' '}
								Page not found
							</div>
							<div className="tasks__noTasks-msg">
								<a href="/">Go Home</a>
							</div>
						</div>
					</Route>
				</Switch>
			)}
		</BrowserRouter>
	);
}

export default App;
