const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json('Hello World');
});

app.listen(process.env.PORT || 8080);
console.log('App started. Date: ' + new Date().toString());
