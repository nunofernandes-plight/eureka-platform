import Annotation from '../schema/annotation.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

export default {
  getAnnotations: async (reviewId) => {
    return await Annotation.find({
      reviewId
    });
  },

  getMyAnnotations: async (owner, articleVersionId) => {
    return await Annotation.find({
      owner,
      articleVersionId
    });
  },

  getAllAnnotations: async (owner, articleVersionId) => {
    return await Annotation.find({
      articleVersionId
    });
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
  }
};