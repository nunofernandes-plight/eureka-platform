import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import isProduction from '../../helpers/isProduction';

if (!isProduction()) {
  dotenv.config();
}

const transportConstants = {
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASSWORD // generated ethereal password
  }
};

let mailOptions = {
  from: '"Eureka Platform 👻" <eureka.platform@hotmail.com>', // sender address
  to: 'andreas.schaufelbuehl@uzh.ch', // list of receivers
  subject: 'Hello', // Subject line
  text: 'Hello world?', // plain text body
  html: '<h1>Hello world?</h1> <br/> <span>normal body text</span>' // html body
};

export default {
  // write the whole options body new
  setMailOptions: (options) => {
    mailOptions = options;
  },

  setMailHTML: (htmlBody) => {
    mailOptions.html = htmlBody;
  },

  setMailText: (textBody) => {
    mailOptions.text = textBody;
  },

  sendMail: () => {
    nodemailer.createTestAccount((err) => {
      if(err) {
        return console.log(err);
      }
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport(transportConstants);

      transporter.sendMail(mailOptions, (error, info) => {
        console.log('Send mail');
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
    });
  }
};



