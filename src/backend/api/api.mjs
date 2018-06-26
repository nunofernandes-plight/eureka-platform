import express from 'express'
import DBConnector from "../db/db";
import {asyncHandler} from "./requestHandler";
import Web3Manager from "../web3/index";
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

// web3 instance
const web3Manager = new Web3Manager();
web3Manager.deployContract();

//database
const dbUrl = 'localhost/eurekaDB';
const db = new DBConnector(dbUrl);


app.get('/reviews', asyncHandler(async (req, res) => {
    let result = await db.getAllReviews();
    return result;
}));

app.post('/reviews', asyncHandler(async (req, res) => {
    const rating = parseInt(req.body.rating);
    let result = await db.insertReview(rating, req.body.text);
    return result;
}));

export default app;