/**
 * Different roles a platform user can have --> access authorization is based on it.
 */
const Roles = Object.freeze({
  CONTRACT_OWNER: 'CONTRACT_OWNER',
  ADMIN: 'ADMIN',
  AUTHOR: 'AUTHOR',
  REVIEWER: 'REVIEWER',
  EDITOR: 'EDITOR',
  USER: 'USER',
  ALL: 'ALL'
});

export const getAllRoles = () => {
  return Object.keys(Roles);
};

export default Roles;
