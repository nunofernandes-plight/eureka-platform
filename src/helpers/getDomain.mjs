import {isProduction} from './isProduction.mjs';

export const getDomain = () => {
	if (isProduction()) {
		// TODO: insert prod url
		return 'prod_url';
	}
	return 'http://localhost:8080';
};
