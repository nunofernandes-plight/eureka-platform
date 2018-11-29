import sgMail from '@sendgrid/mail';
import userService from '../db/user-service.mjs';
import errorThrower from '../helpers/error-thrower.mjs';

export const sendEmail = async ({to, from, subject, html}) => {
  const msg = {
    to,
    from,
    subject,
    html
  };
  return sgMail.send(msg)
    .then(() =>{
      console.log('Email has been sent to ' + to + ' from ' + from);
    })
    .catch(err => {
      console.err('An error occured sending an email to ' + to + ' from ' + from);
    });
};

export const sendEmailByEthereumAddress = async ({ethereumAddress, from, subject, html}) => {
  const user = await userService.getUserByEthereumAddress(
    ethereumAddress
  );
  if (!user) errorThrower.noEntryFoundByParameters(ethereumAddress);

  const msg = {
    to: user.email,
    from,
    subject,
    html
  };
  return sgMail.send(msg)
    .then(() =>{
      console.log('Email has been sent to ' + msg.to + ' from ' + from);
    })
    .catch(err => {
      console.error('An error occured sending an email to ' + msg.to + ' from ' + from + '. ' + err);
    });
};

export const configEmailProvider = () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
};
