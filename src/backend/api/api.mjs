import express from 'express'
import DBConnector from "../db/db";
import Web3Manager from "../web3/index";

const app = express();

// web3 instance
const web3Manager = new Web3Manager();
web3Manager.deployContract();

//database
const dbUrl = 'localhost/eurekaDB';
const db = new DBConnector(dbUrl);

app.get('/', (req, res) => {
    db.getAllReviews().then( (result) => res.json(result)).catch(err => console.log(err));
});

export default app;