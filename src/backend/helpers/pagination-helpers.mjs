export const getLimitedObjects = (fn, pageNumber, nPerPage) => {
  return fn
    .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
    .limit(nPerPage)
};

export const getNumberOfObjects = (fn) => {
  return fn.count();
};

export const getNumberOfPages = async (fn, limit) => {
  const nrOfObjects = await getNumberOfObjects(fn);
  return Math.ceil(nrOfObjects / limit);
};