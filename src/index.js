import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { LoginProvider } from './shared/context/LoginContext';

ReactDOM.render(
	<React.StrictMode>
		<LoginProvider>
			<App />
		</LoginProvider>
	</React.StrictMode>,
	document.getElementById('root')
);

serviceWorker.unregister();
