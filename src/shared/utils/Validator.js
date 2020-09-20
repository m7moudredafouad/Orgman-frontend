const Validate = (value, validator) => {
	let valid = true;
	let errors = [];

	if (validator.isRequired) {
		let isValid = value.trim().length > 0;
		if (!isValid) {
			errors.push('This field is required');
		}
		valid = valid && isValid;
	}

	if (validator.isEmail) {
		// const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;

		let isValid = re.test(String(value).toLowerCase());
		if (!isValid) {
			errors.push('Email is not valid, Please provide a valid email');
		}
		valid = valid && isValid;
	}

	if (validator.minLength) {
		let isValid = value.trim().length >= validator.minLength;
		if (!isValid) {
			errors.push(
				`This field requires ${
					validator.minLength - value.trim().length
				} characters more`
			);
		}
		valid = valid && isValid;
	}

	if (validator.maxLength) {
		let isValid = value.trim().length <= validator.maxLength;
		if (!isValid) {
			errors.push(
				`You should remove ${
					value.trim().length - validator.maxLength
				} characters`
			);
		}
		valid = valid && isValid;
	}

	if (validator.equals) {
		console.log(validator.equals);
		let isValid = value === validator.equals;

		if (!isValid) {
			errors.push('The Passwords are not the same');
		}

		valid = valid && isValid;
	}

	return [valid, errors];
};

export default Validate;
