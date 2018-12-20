import React from 'react';
import {readFileSync} from 'fs';

export const getReviewersInvitationTemplate = article => {
  // TODO change the placeholder in this html with the article data
  const html = readFileSync(
    'src/backend/email/templates/html/REVIEWER_INVITATION.html',
    'utf-8'
  );
  return html;
};

export const getEmailFromDiniMutter = () => {

}