export const fromS3toCdn = (url, query) => {
  return (
    'https://cdn.sciencematters.io' + url.toString().slice(36) + '?' + query
  );
};
