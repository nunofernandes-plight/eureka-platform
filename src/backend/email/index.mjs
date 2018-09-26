import sgMail from '@sendgrid/mail';
import heml from 'heml';
import {writeFileSync, readFileSync} from 'fs';
import {getReviewersInvitationTemplate} from './templates/EmailTemplates.mjs';

export const sendEmail = async ({to, from, subject, html}) => {
  const msg = {
    to,
    from,
    subject,
    html
  };
  console.log('Email has been sent to ' + to + ' from : ' + from);
  return sgMail.send(msg);
};

export const configEmailProvider = () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
};
