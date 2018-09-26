import React from 'react';
import {readFileSync} from 'fs';

export const getReviewersInvitationTemplate = (article) => {
  const html = readFileSync(
    'src/backend/email/templates/html/REVIEWER_INVITATION.html',
    'utf-8'
  );



  console.log(html);
};
