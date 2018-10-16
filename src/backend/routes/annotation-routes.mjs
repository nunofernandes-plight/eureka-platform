import express from 'express';
import {asyncHandler} from '../api/requestHandler.mjs';
import accesController from '../controller/acess-controller.mjs';
import annotationService from '../db/annotation-service.mjs';
const router = express.Router();

router.use(accesController.loggedInOnly);

router.get(
  '/:articleVersionId/:reviewId',
  asyncHandler(async req => {
    let annotations = await annotationService.getAnnotations(req.session.passport.user.ethereumAddress, req.params.articleVersionId);
    return annotations;
  })
);

router.get(
  '/:articleVersionId',
  asyncHandler(async req => {
    let annotations = await annotationService.getAllAnnotations(req.session.passport.user.ethereumAddress, req.params.articleVersionId);
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
      req.body.field,
      req.body.text,
      req.body.isMajorIssue);
    return annotation;
  })
);

router.put(
  '/:annotationId',
  asyncHandler(async req => {
    let annotation = await annotationService.editAnnotation(
      req.session.passport.user.ethereumAddress,
      req.body);
    return annotation;
  })
);

router.delete(
  '/:annotationId',
  asyncHandler(async req => {
    let annotation = await annotationService.deleteAnnotation(
      req.session.passport.user.ethereumAddress);
    return annotation;
  })
);