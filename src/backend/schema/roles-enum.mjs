import mongoose from "mongoose";

/**
 * Different roles a platform user can have --> access authorization is based on it.
 */
const Roles = Object.freeze({
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  REVIEWER: 'REVIEWER',
  GUEST: 'GUEST'
});

export default Roles;