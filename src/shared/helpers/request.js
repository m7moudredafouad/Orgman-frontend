export const deleteRequest = (ids, token, projectId) => {
	return new Promise((resolve, reject) => {
		fetch(`${process.env.REACT_APP_API_URL}/projects/${projectId}/tasks`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token,
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

export const CreateRequest = (newTasks, token, projectId) => {
	return new Promise((resolve, reject) => {
		fetch(`${process.env.REACT_APP_API_URL}/projects/${projectId}/tasks`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token,
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

export const UpdateRequest = (updateThisIds, token, projectId) => {
	return new Promise((resolve, reject) => {
		fetch(`${process.env.REACT_APP_API_URL}/projects/${projectId}/tasks`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				Authorization: token,
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
