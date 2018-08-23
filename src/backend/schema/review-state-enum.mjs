/**
 * Different state a review on an article can have
 */
const REVIEW_STATE = Object.freeze({
  NOT_EXISTING: 'NOT_EXISTING',
  INVITED: 'INVITED',
  INVITATION_ACCEPTED: 'INVITATION_ACCEPTED',
  HANDED_IN_DB: 'HANDED_IN_DB',
  HANDED_IN_SC: 'HANDED_IN_SC',
  DECLINED: 'DECLINED',
  ACCEPTED: 'ACCEPTED'
});

export default REVIEW_STATE;