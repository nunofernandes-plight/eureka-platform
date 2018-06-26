import express from 'express'
import DBConnector from "../db/db";
const app = express();

//database
const dbUrl = 'localhost/eurekaDB';
const db = new DBConnector(dbUrl);

app.get('/reviews', (req, res) => {
    db.getAllReviews().then( (result) => res.json(result)).catch(err => console.log(err));
});

app.get('/insertReview',  async (req, res) => {
   let result = await db.insertReview(3, 'test');
   if(result) {
       res.json('Success')
   } else {
       res.json('Error')
   }
});

export default app;