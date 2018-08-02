const ApiCall = (url, options = {}) => {
    options.credentials = 'include';
    options.headers = new Headers({
        'CSRF-Token': window._csrf,
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
                return response.json();
            })
            .then(response => {
                if (!response.success) {
                    const err = new Error(response.error);
                    err.code = response.code;
                    throw err;
                }
                resolve(response);
            })
            .catch(reject);
    });
};

export default ApiCall;
