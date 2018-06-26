import express from 'express'
import DBConnector from "../db/db";
import {asyncHandler} from "./requestHandler";
import Web3Manager from "../web3/index";
import bodyParser from 'body-parser';
import router from "../routes/index";

const app = express();
app.use(bodyParser.json());

// api routes
app.use("/api", router);

// web3 instance
const web3Manager = new Web3Manager();
web3Manager.deployContract();

export default app;