const ApiCall = (url, options = {}) => {
	options.headers = new Headers({
		'Content-Type': 'application/json'
	});
	return new Promise((resolve, reject) => {
		fetch(url, options)
			.then(response => {
				if (response.status === 500) {
					throw new Error('Server is offline');
				}
				if (response.status === 404) {
					throw new Error('Not found');
				}
				return response;
			})
			.catch(reject);
	});
};

export default ApiCall;
