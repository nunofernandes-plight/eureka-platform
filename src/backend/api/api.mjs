import express from 'express';
import bodyParser from 'body-parser';
import router from '../routes/index.mjs';

const app = express();
app.use(bodyParser.json());

// api routes
app.use('/api', router);

export default app;
