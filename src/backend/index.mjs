import express from 'express'
import DBConnector from "./db";
const app = express();

//database
const dbUrl = 'localhost/eurekaDB';
const db = new DBConnector(dbUrl);

app.get('/', (req, res) => {
  db.getAllReviews().then( (result) => res.json(result)).catch(err => console.log(err));
});

app.listen(process.env.PORT || 8080);
console.log('App started. Date: ' + new Date().toString());
