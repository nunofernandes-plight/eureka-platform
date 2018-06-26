const isProduction = () => {
  // for client-side
  if (typeof window !== 'undefined') {
    return window.location.hostname !== 'localhost';
  }
  // for server-side
  return process.env.NODE_ENV === 'production';
};

export default isProduction;
