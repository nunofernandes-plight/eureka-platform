
function S3Upload(options) {
	if (!options) {
		options = {};
	}
	/*
      eslint-disable guard-for-in
    */
	for (const option in options) {
		this[option] = options[option];
	}
	// This.handleFileSelect(document.getElementById(this.file_dom_selector));
}

S3Upload.prototype.s3_object_name = 'default_name';

S3Upload.prototype.s3_sign_put_url = '/signS3put';

S3Upload.prototype.file_dom_selector = 'file_upload';

S3Upload.prototype.onFinishS3Put = function (public_url) {
	return console.log('base.onFinishS3Put()', public_url);
};

S3Upload.prototype.onProgress = function (percent, status) {
	return console.log('base.onProgress()', percent, status);
};

S3Upload.prototype.onError = function (status) {
	return console.log('base.onError()', status);
};

S3Upload.prototype.onSign = function (status) {
	return console.log('base.onSign()', status);
};

S3Upload.prototype.handleFileSelect = function (file_element) {
	let f;
	let files;
	let _i;
	let _len;
	let _results = [];
	this.onProgress(0, 'Upload started.');
	files = file_element.files;
	_results = [];
	for (_i = 0, _len = files.length; _i < _len; _i++) {
		f = files[_i];
		_results.push(this.uploadFile(f));
	}
	return _results;
};

S3Upload.prototype.createCORSRequest = function (method, url) {
	let xhr;
	xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
	if (xhr.withCredentials !== null) {
		xhr.open(method, url, true);
		/* eslint-disable no-undef,no-negated-condition */
	} else if (typeof XDomainRequest !== 'undefined') {
		xhr = new XDomainRequest();
		/* eslint-enable no-undef,no-negated-condition */
		xhr.open(method, url);
	} else {
		xhr = null;
	}
	return xhr;
};

S3Upload.prototype.executeOnSignedUrl = function (file, callback) {
	let this_s3upload;
	let xhr;
	this_s3upload = this;
	xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
	xhr.open(
		'GET',
		this.s3_sign_put_url +
        '?s3_object_type=' +
        file.type +
        '&s3_object_name=' +
        file.name,
		true
	);
	xhr.overrideMimeType('text/plain; charset=x-user-defined');
	xhr.onreadystatechange = function () {
		let result;
		if (this.readyState === 4 && this.status === 200) {
			try {
				result = JSON.parse(this.responseText);
			} catch (err) {
				this_s3upload.onError(
					'Signing server returned some ugly/empty JSON: "' +
                    this.responseText +
                    '"'
				);
				return false;
			}
			return callback(result.signed_request, result.url);
		} if (this.readyState === 4 && this.status !== 200) {
			return this_s3upload.onError(
				'Could not contact request signing server. Status = ' + this.status
			);
		}
	};
	return xhr.send();
};

S3Upload.prototype.uploadToS3 = function (file, url, public_url) {
	let this_s3upload;
	let xhr;
	this_s3upload = this;
	xhr = this.createCORSRequest('PUT', url);
	if (xhr) {
		xhr.addEventListener('load', () => {
			if (xhr.status === 200) {
				this_s3upload.onProgress(100, 'Upload completed.');
				return this_s3upload.onFinishS3Put(public_url);
			}
			return this_s3upload.onError('Upload error: ' + xhr.status);
		});
		xhr.addEventListener('error', () => {
			return this_s3upload.onError('XHR error.');
		});
		xhr.upload.addEventListener('progress', e => {
			let percentLoaded;
			if (e.lengthComputable) {
				percentLoaded = Math.round(e.loaded / e.total * 100);
				return this_s3upload.onProgress(
					percentLoaded,
					percentLoaded === 100 ? 'Finalizing.' : 'Uploading.'
				);
			}
		});
	} else {
		this.onError('CORS not supported');
	}
	xhr.setRequestHeader('Content-Type', file.type);
	xhr.setRequestHeader('x-amz-acl', 'public-read');
	return xhr.send(file);
};

S3Upload.prototype.uploadFile = function (file) {
	let this_s3upload;
	this_s3upload = this;
	return this.executeOnSignedUrl(file, (signedURL, publicURL) => {
		this_s3upload.onSign(publicURL);
		return this_s3upload.uploadToS3(file, signedURL, publicURL);
	});
};

export default S3Upload;
