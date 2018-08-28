/**
 * Different roles a platform user can have --> access authorization is based on it.
 */
const Roles = Object.freeze({
  CONTRACT_OWNER: 'CONTRACT_OWNER',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  USER: 'USER',
});

export default Roles;
