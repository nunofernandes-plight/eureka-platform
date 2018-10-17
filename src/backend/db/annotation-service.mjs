import Annotation from '../schema/annotation.mjs';
import errorThrower from '../helpers/error-thrower.mjs';
import reviewService from './review-service.mjs';
import {getIds} from '../helpers/get-array-of-ids.mjs';

export default {
  getAnnotations: async (reviewId) => {
    return await Annotation.find({
      reviewId
    })
      .sort({date: -1});
  },

  getAllAnnotations: async (owner, articleVersionId) => {
    const reviews = await reviewService.getReviewsFromArticle(articleVersionId);
    const ids = getIds(reviews);
    return await Annotation.find({
      reviewId: {$in: ids}
    })
      .sort({date: -1});
  },

  createAnnotation: async (reviewId, articleVersionId, owner, field, text, isMajorIssue) => {
    const date = new Date().getTime();
    const annotation = new Annotation({
      reviewId,
      articleVersionId,
      owner,
      field,
      text,
      date,
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

    annotation.field = field;
    annotation.text = text;
    annotation.isMajorIssue = isMajorIssue;
    annotation.date = new Date().getTime();

    return await Annotation.findByIdAndUpdate(annotation._id, annotation);
  },

  deleteAnnotation: async (annotationId, owner) => {
    const annotation = await Annotation.findOne({
      _id: annotationId
    });
    if (!annotation) errorThrower.noEntryFoundById(annotationId);
    if (annotation.owner !== owner)
      errorThrower.notCorrectEthereumAddress();

    return await annotation.remove();
  }
};