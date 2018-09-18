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
import contractEventListener from '../web3/contract-event-lister.mjs';
import uploadRouter from '../routes/file-upload.routes.mjs';
import {getContractOwner} from '../../smartcontracts/methods/web3-platform-contract-methods.mjs';
import ContractOwner from '../schema/contract-owner.mjs';
import ganachePlatformABI from '../../smartcontracts/constants/GanachePlatformContractABI.json';
import ganacheTokenABI from '../../smartcontracts/constants/GanacheTokenContractABI.json';
import web3 from '../web3/web3Instance.mjs';
import {
  PLATFORM_KOVAN_ADDRESS,
  TOKEN_KOVAN_ADDRESS
} from '../../smartcontracts/constants/KovanContractAddresses.mjs';
import {setupWeb3Interface} from '../web3/web3InterfaceSetup.mjs';

if (!isProduction) {
  dotenv.config();
}

let app;
let server;

export default {
  setupApp: () => {
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

    /** Web3 Interface: SC Events Listener, Transaction Listener**/
    setupWeb3Interface();

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