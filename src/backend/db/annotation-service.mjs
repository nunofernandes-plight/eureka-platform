import Annotation from '../schema/annotation.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

export default {
  getAnnotations: async (owner, articleVersionId) => {
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
  }
};