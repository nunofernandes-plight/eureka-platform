import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import cors from 'cors';
import passport from '../helpers/local-passport.mjs';
import mongooseDB from '../db/mongoose-db.mjs';
import {isProduction} from '../../helpers/isProduction.mjs';
import router from '../routes/index.mjs';
import contractEventListener from '../controller/contract-event-controller.mjs';
import uploadRouter from '../routes/file-upload.routes.mjs';
import {getContractOwner} from '../web3/web3-platform-contract-methods.mjs';
import ContractOwner from '../schema/contract-owner.mjs';
import eurekaPlatformABI from '../../frontend/web3/eurekaPlatform-ABI.json';
import eurekaTokenABI from '../../frontend/web3/eurekaToken-ABI.json';
import web3 from '../web3/web3Instance.mjs';
import {
  PLATFORM_KOVAN_ADDRESS,
  TOKEN_KOVAN_ADDRESS
} from '../../frontend/web3/KovanAddresses.mjs';


if (!isProduction) {
  dotenv.config();
}

let app;
let server;

export default {
  setupApp: eurekaPlatformContract => {
    app = express();

    /** Parser **/
    //Parses the text as URL encoded data
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

    const MongoStore = connectMongo(session);
    app.use(
      session({
        secret: 'eureka secret snippet', //TODO change to env variable
        //secret: process.env.DB_USER,
        resave: false,
        //stores session into DB
        store: new MongoStore({
          mongooseConnection: mongooseDB.connection
        }),
        saveUninitialized: false,
        name: 'eureka.sid',
        cookie: {maxAge: 24 * 3600000, secure: false, httpOnly: false}
      })
    );

    app.use(cors({credentials: true, origin: ['http://localhost:3000']}));

    /** Passport setup **/
    app.use(passport.initialize());
    app.use(passport.session());

    /** SC Events Listener **/
    // if(!isProduction()) { swap to that
    if (eurekaPlatformContract) {
      contractEventListener.setup(eurekaPlatformContract);
      writeContractOwnerInDB(eurekaPlatformContract);
    } else {
      // TODO setup with constant public address
      const platformContract = new web3.eth.Contract(eurekaPlatformABI, PLATFORM_KOVAN_ADDRESS);
      const tokenContract = new web3.eth.Contract(eurekaTokenABI, TOKEN_KOVAN_ADDRESS);
      contractEventListener.setup(platformContract);
      writeContractOwnerInDB(platformContract);

      /** Pending Transaction listener **/
      web3.eth.subscribe('pendingTransactions')
        .on('data', async (transactionHash) => {
          console.log(transactionHash);
          const transaction = await web3.eth.getTransaction(transactionHash);
          if ( transaction
            && ( transaction.to === platformContract.options.address
                || transaction.from === platformContract.options.address
                || transaction.to === tokenContract.options.address
              )
            ) {

            //TODO save transaction because related with platform
            // check status firs if transaction receipt call is necessary
            const transactionReceipt = await web3.eth.getTransactionReceipt(transactionHash);
            console.log(transactionReceipt);
          }
        });
    }

    //set global variable isAuthenticated -> call ir everywhere dynamically
    app.use(function(req, res, next) {
      res.locals.isAuthenticated = req.isAuthenticated();
      next();
    });


    //Parses the text as JSON and exposes the resulting object on req.body.
    app.use(bodyParser.json());

    app.use('/api', router);
    app.get('/fileupload', uploadRouter);
  },

  listenTo: port => {
    server = app.listen(port || 8080);
  },

  close: () => {
    server.close();
  }
};


async function writeContractOwnerInDB(contract) {
  const id = 1;
  const contractOwnerAddress = await getContractOwner(contract);
  let contractOwner = await ContractOwner.findById(id);
  if(!contractOwner) {
    contractOwner = new ContractOwner({
      _id: id,
      address: contractOwnerAddress
    });
  } else {
    contractOwner.address = contractOwnerAddress;
  }
  await contractOwner.save();
  //mongooseDB.connection.close();
  return 'ContractOwner saved in DB';
}