import React, { Fragment, useState } from 'react';
import ReactDOM from 'react-dom';

const ModalMsg = (props) => {
	const content = (
		<div className="modal">
			<div className="modal__container">
				<div className="modal__header">{props.header}</div>
				<div className="modal__body">{props.msg}</div>
				<div className="modal__footer">
					<button className="btn btn-red btn-sm">Cancel</button>
					<button className="btn btn-dark btn-sm">Create</button>
				</div>
			</div>
		</div>
	);

	return ReactDOM.createPortal(content, document.getElementById('modal'));
};

const ModalFrom = (props) => {
	const [titleState, setTitleState] = useState(props.value);
	const [doneState, setDoneState] = useState(props.checked);

	const changeTitle = (value) => {
		setTitleState(value);
	};

	const changeDone = (value) => {
		setDoneState(value);
	};

	const content = (
		<div className="modal">
			<div className="modal__container">
				<div className="modal__header">{props.header}</div>
				<div className="modal__body">
					<form className="form">
						<input
							type="checkbox"
							checked={doneState}
							onChange={(e) => changeDone(e.target.checked)}
						/>
						<input
							type="text"
							className="form__input"
							placeholder="Title"
							value={titleState}
							onChange={(e) => changeTitle(e.target.value)}
						/>
					</form>
				</div>
				<div className="modal__footer">
					<button className="btn btn-red btn-sm" onClick={props.onClose}>
						Cancel
					</button>
					<button
						className="btn btn-dark btn-sm"
						onClick={() => props.onSave(titleState, doneState)}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);

	return ReactDOM.createPortal(content, document.getElementById('modal'));
};

const Modal = (props) => {
	return (
		<Fragment>
			{props.type === 'msg' ? (
				<ModalMsg {...props} />
			) : (
				<ModalFrom {...props} />
			)}
		</Fragment>
	);
};

export default Modal;
