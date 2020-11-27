import React, { Fragment, useContext, useReducer } from 'react';

import { LoginContext } from '../../shared/context/LoginContext';

import Input from '../../shared/Input/Input';
import Validator from '../../shared/utils/Validator';
import Spinner from '../../shared/Modal/Spinner';

const checkFormIsValid = (inputs) => {
	let isValid = true;
	Object.keys(inputs).forEach((key) => {
		if (!isValid) return;
		isValid = isValid && inputs[key].isValid;
	});
	return isValid;
};

const reducer = (state, action) => {
	let virtualState = { ...state };

	switch (action.type) {
		case 'CHANGE':
			// The Main Input Chaging
			let input = virtualState.inputs[action.payload.input];
			if (input.validations) {
				[input.isValid, input.errors] = Validator(
					action.payload.value,
					input.validations
				);
			}
			input.value = action.payload.value;

			// Other Validations
			virtualState.formIsValid = checkFormIsValid(virtualState.inputs);

			// If Signup validate the 2 passwords
			if (!virtualState.isLogin) {
				if (
					virtualState.inputs.password.value !==
					virtualState.inputs['confirm password'].value
				) {
					virtualState.formIsValid = false;
					virtualState.inputs['confirm password'].errors = [
						'Passwords are not the same',
					];
				} else {
					virtualState.inputs['confirm password'].errors = [];
					virtualState.inputs['confirm password'].isValid = true;
				}
			}

			return virtualState;

		case 'CHANGE_ISLOGIN':
			virtualState.isLogin = action.payload.isLogin;
			return virtualState;
		default:
			return state;
	}
};

const Register = () => {
	const { loginError, loading, login, signup } = useContext(LoginContext);

	const initialState = {
		inputs: {
			email: {
				type: 'email',
				value: '',
				errors: [],
				isValid: false,
				validations: {
					isEmail: true,
				},
			},
			password: {
				type: 'password',
				value: '',
				isValid: false,
				errors: [],
				validations: {
					minLength: 6,
				},
			},
		},
		formIsValid: false,
		isLogin: true,
	};

	const [registerState, dispatch] = useReducer(reducer, initialState);

	const onChange = (input, value) => {
		dispatch({ type: 'CHANGE', payload: { input, value } });
	};

	const changeIsLogin = (state) => {
		let nameInput = {
			type: 'text',
			value: '',
			errors: [],
			isValid: false,
			validations: {
				minLength: 3,
			},
		};
		let confirmPassword = {
			type: 'password',
			value: '',
			isValid: false,
			errors: [],
		};

		if (state) {
			delete registerState.inputs.username;
			delete registerState.inputs['confirm password'];
		} else {
			registerState.inputs['confirm password'] = { ...confirmPassword };
			registerState.inputs.username = { ...nameInput };
		}

		dispatch({ type: 'CHANGE_ISLOGIN', payload: { isLogin: state } });
	};

	const onSubmit = (e) => {
		e.preventDefault();
		if (registerState.isLogin) {
			login(
				registerState.inputs.email.value,
				registerState.inputs.password.value
			);
		} else {
			signup(
				registerState.inputs.username.value,
				registerState.inputs.email.value,
				registerState.inputs.password.value,
				registerState.inputs['confirm password'].value
			);
		}
	};

	const renderInputs = () => {
		return Object.keys(registerState.inputs).map((key) => {
			return (
				<Input
					key={key}
					name={key}
					type={registerState.inputs[key].type}
					value={registerState.inputs[key].value}
					errors={registerState.inputs[key].errors}
					onChange={onChange}
				/>
			);
		});
	};

	return (
		<Fragment>
			{loading && <Spinner />}
			<div className="main__register">
				<h2 className="main__register-h2">
					{registerState.isLogin
						? 'Login to your orgman account'
						: 'Signup with orgman'}
				</h2>
				<form className="form" onSubmit={(e) => onSubmit(e)}>
					{renderInputs()}

					<div className="form__btns">
						<button
							type="submit"
							className={`btn ${
								registerState.formIsValid ? 'btn-dark' : 'btn-disabled'
							}`}
							disabled={!registerState.formIsValid}
						>
							{registerState.isLogin ? 'Login' : 'Signup'}
						</button>

						{registerState.isLogin ? (
							<button
								className="btn main__register-switch"
								type="button"
								onClick={() => changeIsLogin(false)}
							>
								No account yet?
							</button>
						) : (
							<button
								className="btn main__register-switch"
								type="button"
								onClick={() => changeIsLogin(true)}
							>
								Login instead?
							</button>
						)}
					</div>
					{loginError ? (
						<ul className="form__label-error">
							<li>{loginError}</li>
						</ul>
					) : null}
				</form>
			</div>
		</Fragment>
	);
};

export default Register;
