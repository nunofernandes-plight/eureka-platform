import mongoose from 'mongoose';
import Review from '../../src/backend/schema/review.mjs';
import ReviewState from '../../src/backend/schema/review-state-enum.mjs';
import {NO_ISSUES_REVIEW_1, NO_ISSUES_REVIEW_2, MAJOR_ISSUE_REVIEW_1} from './test-data.js';

export const TEST_INVITIED_REVIEW_1 = new Review({
  reviewerAddress: '0xa7F19Ef5E368aB16Cc9ffA1B76C75382d0154F2F',
  reviewText: NO_ISSUES_REVIEW_1.reviewText,
  reviewHash: NO_ISSUES_REVIEW_1.reviewHash,
  reviewScore1: NO_ISSUES_REVIEW_1.score1,
  reviewScore2: NO_ISSUES_REVIEW_1.score2,
  articleHasMajorIssues: NO_ISSUES_REVIEW_1.articleHasMajorIssues,
  articleHasMinorIssues: NO_ISSUES_REVIEW_1.articleHasMinorIssues,
  reviewState: ReviewState.INVITED,
  stateTimestamp: new Date().getTime(),
  articleVersion: mongoose.Types.ObjectId()
});

export const TEST_INVITIED_REVIEW_2 = new Review({
  reviewerAddress: '0xA8Dd80d44959490bcAAdc41d916A9D8a5d0038CC',
  reviewText: NO_ISSUES_REVIEW_2.reviewText,
  reviewHash: NO_ISSUES_REVIEW_2.reviewHash,
  reviewScore1: NO_ISSUES_REVIEW_2.score1,
  reviewScore2: NO_ISSUES_REVIEW_2.score2,
  articleHasMajorIssues: NO_ISSUES_REVIEW_2.articleHasMajorIssues,
  articleHasMinorIssues: NO_ISSUES_REVIEW_2.articleHasMinorIssues,
  reviewState: ReviewState.INVITED,
  stateTimestamp: new Date().getTime(),
  articleVersion: mongoose.Types.ObjectId()
});

export const TEST_INVITATION_ACCEPTED_REVIEW_1 = new Review({
  reviewerAddress: '0xbB44e39bF87016b167997922597591Bdff68Fd44',
  reviewText: MAJOR_ISSUE_REVIEW_1.reviewText,
  reviewHash: MAJOR_ISSUE_REVIEW_1.reviewHash,
  reviewScore1: MAJOR_ISSUE_REVIEW_1.score1,
  reviewScore2: MAJOR_ISSUE_REVIEW_1.score2,
  articleHasMajorIssues: MAJOR_ISSUE_REVIEW_1.articleHasMajorIssues,
  articleHasMinorIssues: MAJOR_ISSUE_REVIEW_1.articleHasMinorIssues,
  reviewState: ReviewState.INVITED,
  stateTimestamp: new Date().getTime(),
  articleVersion: mongoose.Types.ObjectId()
});