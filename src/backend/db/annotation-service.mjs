import Annotation from '../schema/annotation.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import reviewService from './review-service.mjs';
import {getIds} from '../helpers/get-array-of-ids.mjs';
import REVIEW_STATE from '../schema/review-state-enum.mjs';

export default {
  getAnnotations: async (reviewId, user) => {
    return await Annotation.find({
      reviewId
    })
      .sort({updated: -1});
  },

  getAllAnnotations: async (articleVersionId, user) => {
    const reviews = await reviewService.getReviewsFromArticle(articleVersionId);
    const ids = getIds(reviews);
    return await Annotation.find({
      reviewId: {$in: ids}
    })
      .sort({updated: -1});
  },

  createAnnotation: async (reviewId, articleVersionId, owner, field, text, isMajorIssue) => {

    const review = await reviewService.getReviewById(owner, reviewId);
    if (!review) errorThrower.noEntryFoundById(reviewId);
    if(review.reviewerAddress !== owner) errorThrower.notAuthorizedToDoThisAction();
    if(review.reviewState !== REVIEW_STATE.HANDED_IN_DB) errorThrower.notAuthorizedToDoThisAction();

    const created = new Date().getTime();
    const annotation = new Annotation({
      reviewId,
      articleVersionId,
      owner,
      field,
      text,
      created,
      isMajorIssue
    });

    const dbAnnotation = await annotation.save();
    if (!dbAnnotation) errorThrower.noCreationOfEntry('Annotation');
    return dbAnnotation;
  },

  editAnnotation: async (annotationId, owner, field, text, isMajorIssue) => {
    const annotation = await Annotation.findOne({
      _id: annotationId
    });
    if (!annotation) errorThrower.noEntryFoundById(annotationId);
    if (annotation.owner !== owner)
      errorThrower.notCorrectEthereumAddress();

    const review = await reviewService.getReviewById(owner, annotation.reviewId);
    if (!review) errorThrower.noEntryFoundById(annotation.reviewId);
    if(review.reviewState !== REVIEW_STATE.HANDED_IN_DB) errorThrower.notAuthorizedToDoThisAction();

    annotation.field = field;
    annotation.text = text;
    annotation.isMajorIssue = isMajorIssue;
    annotation.updated = new Date().getTime();

    return await Annotation.findByIdAndUpdate(annotation._id, annotation);
  },

  deleteAnnotation: async (annotationId, owner) => {
    const annotation = await Annotation.findOne({
      _id: annotationId
    });
    if (!annotation) errorThrower.noEntryFoundById(annotationId);
    if (annotation.owner !== owner)
      errorThrower.notCorrectEthereumAddress();

    const review = await reviewService.getReviewById(owner, annotation.reviewId);
    if (!review) errorThrower.noEntryFoundById(annotation.reviewId);
    if(review.reviewState !== REVIEW_STATE.HANDED_IN_DB) errorThrower.notAuthorizedToDoThisAction();

    return await annotation.remove();
  }
};