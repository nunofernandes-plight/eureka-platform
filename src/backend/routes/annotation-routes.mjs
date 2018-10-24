import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import accesController from '../controller/acess-controller.mjs';
import annotationService from '../db/annotation-service.mjs';

const router = express.Router();

router.use(accesController.loggedInOnly);

router.get(
  '/:articleVersionId/all',
  asyncHandler(async req => {
    let annotations = await annotationService.getAllAnnotations(req.params.articleVersionId, req.session.passport.user.ethereumAddress);
    return annotations;
  })
);

router.get(
  '/:reviewId',
  asyncHandler(async req => {
    let annotations = await annotationService.getAnnotations(req.params.reviewId, req.session.passport.user.ethereumAddress);
    return annotations;
  })
);

router.post(
  '/',
  asyncHandler(async req => {
    let annotation = await annotationService.createAnnotation(
      req.body.reviewId,
      req.body.articleVersionId,
      req.session.passport.user.ethereumAddress,
      req.body.field
    );
    return annotation;
  })
);

router.put(
  '/:annotationId',
  asyncHandler(async req => {
    let annotation = await annotationService.editAnnotation(
      req.params.annotationId,
      req.session.passport.user.ethereumAddress,
      req.body.text,
      req.body.isMajorIssue);
    return annotation;
  })
);

router.delete(
  '/:annotationId',
  asyncHandler(async req => {
    let annotation = await annotationService.deleteAnnotation(
      req.params.annotationId,
      req.session.passport.user.ethereumAddress);
    return annotation;
  })
);

export default router;