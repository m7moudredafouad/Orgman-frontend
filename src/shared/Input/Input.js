import React from 'react';

const Input = (props) => {
	const renderErrors = () => {
		return props.errors.map((err, i) => {
			return <li key={i}>{err}</li>;
		});
	};
	return (
		<div className="form__label">
			<p className="form__label-text">{props.name}</p>

			<input
				type={props.type || 'text'}
				className="form__input form__input-noBack"
				onChange={(e) => props.onChange(props.name, e.target.value)}
				value={props.value}
			/>

			{props.errors.length > 0 ? (
				<ul className="form__label-error">{renderErrors()}</ul>
			) : null}
		</div>
	);
};

export default Input;
