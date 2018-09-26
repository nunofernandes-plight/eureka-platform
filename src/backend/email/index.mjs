import sgMail from '@sendgrid/mail';
import heml from 'heml';
import {writeFileSync, readFileSync} from 'fs';

export const createEmail = ({content}) => {
  const template = `
<heml>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css?family=Raleway');
      body {
        background: #fdfdfd url(https://s3.amazonaws.com/sosjournals/comic.png);
        background-size: 250px;
        font-family: 'Raleway', sans-serif;
        
      }
      .wrapper {
        max-width: 700px;
        margin: auto;
        padding-left: 10px;
        padding-right: 10px;
      }

      header {
        padding-top: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      footer {
        max-width: 660px;
        padding-left: 20px;
        padding-right: 20px;
        margin: auto;
        font-size: 13px;
        margin-top: 5px;
        padding-bottom: 15px;
        padding-top: 20px;
        background: rgba(255, 255, 255, 0.7);
        
        
      }

    </style>
  </head>
  <body>
    <div class="wrapper">
    <container >
      <header>
      <row>
        <column large="1">
            <h1>iasfjoasjof</h1>
        </column>
      </row>
      </header>
      <section>
      <p>
        ${content}
      </p>
      </section>
    </container>
    </div>
    <footer>
    <row>
      <column>
        <img src="https://s3.amazonaws.com/sosjournals/eureka.png" style="margin-bottom: -10px; display: inline; width: 280px; height: 115px; "/><br/>
        by ScienceMatters. 
      </column>
      </row>

    </footer>
  </body>
</heml>
`;
  return heml(template);
};

export const sendEmail = async ({to, from, subject, content, link}) => {
  console.log(to, from, subject);
  //const {html} = createEmail({content});

  const html = readFileSync(
    'src/backend/email/templates/reviewers_intivation.html',
    'utf8'
  );
  const msg = {
    to,
    from,
    subject,
    html
  };
  writeFileSync('mail.html', html);
  console.log('Email has been sent to ' + to);
  return sgMail.send(msg);
};

export const configEmailProvider = () => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
};
