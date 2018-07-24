import isProduction from '../../src/helpers/isProduction';
import deployContracts from '../../src/backend/web3/index';
import app from '../../src/backend/api/api.mjs';
import dotenv from 'dotenv';
import contractMethodTester from './contract-method-tester';

if (!isProduction()) {
  //import env variables from .env file
  dotenv.config();

  deployContracts().then(([eurekaTokenContract, eurekaPlatformContract]) => {
    //start backend
    app.setupApp(eurekaPlatformContract);
    app.listenTo(process.env.PORT || 8080);

    //Test contract methods
    contractMethodTester.setup(eurekaTokenContract, eurekaPlatformContract)
      .then(account => {
        //Trigger functions on SC
        contractMethodTester.testSignUpEditor();
        contractMethodTester.testSubmitArticle();
      })
      .catch(error => {
        console.log(error);
      });
  });
}
