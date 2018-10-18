export const getIds = objects => {
  return objects.map(i => {
    return i._id;
  });
};