import express from 'express'
import DBConnector from "../db/db";
<<<<<<< HEAD
import {asyncHandler} from "../requestHandler";
=======
import Web3Manager from "../web3/index";
>>>>>>> dcaa2d167f77d3dc114ecf5e06a5d222d4b68638

const app = express();

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

app.get('/insertReview', asyncHandler(async (req, res) => {
    let result = await db.insertReview(3, 'test');
    return result;
}));

export default app;