import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import themeRoute from './app/routes/themeRoute.js';
import sourceRoute from './app/routes/sourceRoute.js';
import campaignRoute from './app/routes/campaignRoute.js';

dotenv.config();

const app = express()

app.use(cors());
app.use(bodyParser.json());
// Add middleware for parsing JSON and urlencoded data and populating `req.body`
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/api/v1', themeRoute);
app.use('/api/v1', sourceRoute);
app.use('/api/v1', campaignRoute);
app.get('/', (req, res) => res.json({ message: 'Welcome To Campaign Service' }))

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))