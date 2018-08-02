import {isProduction} from './isProduction.mjs';

export const getDomain = () => {
  if (isProduction()) {
    // TODO: insert prod url
    return 'prod_url';
  } else {
    return 'http://localhost:8080';
  }
};
