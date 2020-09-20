import React, { Fragment, useState } from 'react';
import ReactDOM from 'react-dom';

const ModalMsg = (props) => {
	const content = (
		<div className="modal">
			<div className="modal__container">
				<div className="modal__header">{props.header}</div>
				<div className="modal__body">{props.msg}</div>
				<div className="modal__footer">
					<button className="btn btn-dark btn-sm" onClick={props.onClose}>
						Go Home
					</button>
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
				<div className="modal__header">
					<p>{props.header}</p>
					<button className="btn modal__header-close" onClick={props.onClose}>
						x
					</button>
				</div>
				<div className="modal__body">
					<form
						className="form"
						onSubmit={(e) => {
							e.preventDefault();
							props.onSave(titleState, doneState);
						}}
					>
						<div className="form__group">
							<input
								type="text"
								className="form__input form__input-big"
								placeholder="Title"
								value={titleState}
								autoFocus={true}
								onChange={(e) => changeTitle(e.target.value)}
							/>
							<input
								type="checkbox"
								className="form__checkbox"
								checked={doneState}
								onChange={(e) => changeDone(e.target.checked)}
							/>
						</div>
					</form>
				</div>
				<div className="modal__footer">
					<button
						className="btn btn-dark"
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
