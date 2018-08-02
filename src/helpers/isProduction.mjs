export const isProduction = () => {
  // for client-side
  if (typeof window !== 'undefined') {
    return window.location.hostname !== 'localhost';
  }
  // for server-side
  return process.env.NODE_ENV === 'production';
};

export const isTest = () => {
  // for client-side --> TODO
  // for server-side
  return process.env.NODE_ENV === 'test';
};

export const isDevelopment = () => {
  // for client-side --> TODO
  // for server-side
  return process.env.NODE_ENV === 'development';
};