import Annotation from '../schema/annotation.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

export default {

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