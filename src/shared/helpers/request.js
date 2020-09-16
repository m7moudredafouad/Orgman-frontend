export const deleteRequest = (ids) => {
	return new Promise((resolve, reject) => {
		fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				deleteThisIds: [...ids],
			}),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const CreateRequest = (newTasks) => {
	return new Promise((resolve, reject) => {
		fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ newTasks }),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

export const UpdateRequest = (updateThisIds) => {
	return new Promise((resolve, reject) => {
		fetch(`${process.env.REACT_APP_API_URL}/tasks`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ updateThisIds }),
		})
			.then((res) => {
				return res.json();
			})
			.then((data) => {
				resolve(data);
			})
			.catch((err) => {
				reject(err);
			});
	});
};
