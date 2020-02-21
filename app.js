// load environment variables
require('dotenv').config;

// dependecies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');

//database client
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();

//application setup
const app = express();

app.use(morgan('dev'));
app.use(cors());

//API ROUTES

app.get('/', (req, res) => {
    res.json({
        message: 'hello! :D'
    });   
});

app.get('api/weed', async(req, res) => {
    try {
        const result = await client.query(`
        SELECT 
        strain,
        type, 
        smell,
        thc,
        outdoor,
        indoor
        FROM weed;
        `);
        console.log(result);
        res.json(result.rows);

    } catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});




















const port = process.env.PORT || 3000;

// start server
app.listen(port, () => {
    console.log('the server is running :D on PORT', port);
});

module.exports = {
    app: app,
};




