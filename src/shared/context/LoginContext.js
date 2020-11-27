import React, { useEffect, useState } from 'react';

export const LoginContext = React.createContext();

let logoutTimer = null;
export const LoginProvider = (props) => {
	const [tokenState, setTokenState] = useState(null);
	const [expiresState, setExpiresState] = useState(null);
	const [loginError, setLoginError] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let savedToken = localStorage.getItem('token');
		let savedExpires = localStorage.getItem('expires');
		if (
			savedToken &&
			savedExpires &&
			parseInt(savedExpires) > new Date().getTime()
		) {
			setTokenState(localStorage.getItem('token'));
		} else if (parseInt(savedExpires) < new Date().getTime()) {
			return logout();
		}
	}, []);

	useEffect(() => {
		if (tokenState && expiresState) {
			const remainingTime = parseInt(expiresState) - new Date().getTime();
			logoutTimer = setTimeout(logout, remainingTime);
		} else {
			clearTimeout(logoutTimer);
		}
	}, [tokenState, expiresState]);

	const login = (email, password) => {
		setLoading(true);
		fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if (!data.success) {
					return setLoginError(data.message);
				}

				setTokenState(data.token);
				setExpiresState(data.expires);
				localStorage.setItem('token', data.token);
				localStorage.setItem('expires', data.expires);
				// console.log(data.token);
				setLoading(false);
			})
			.catch((err) => {
				setLoginError(err);
				// console.log(err);
			});
	};

	const signup = (name, email, password, passwordConfirm) => {
		setLoading(true);
		fetch(`${process.env.REACT_APP_API_URL}/users/signup`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name,
				email,
				password,
				passwordConfirm,
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				if (!data.success) {
					return setLoginError(data.message);
				}

				setTokenState(data.token);
				setExpiresState(data.expires);
				localStorage.setItem('token', data.token);
				localStorage.setItem('expires', data.expires);
				// console.log(data.token);
				setLoading(false);
			})
			.catch((err) => {
				setLoginError(err);
				// console.log(err);
			});
	};

	const logout = () => {
		setTokenState(null);
		localStorage.removeItem('token');
		localStorage.removeItem('expires');
		window.location.assign('/');
	};

	return (
		<LoginContext.Provider
			value={{
				loginError,
				loading,
				isLoggedIn: !!tokenState,
				token: tokenState,
				login,
				signup,
				logout,
			}}
		>
			{props.children}
		</LoginContext.Provider>
	);
};
