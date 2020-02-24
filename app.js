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
//Smiley face route
app.get('/', (req, res) => {
    res.json({
        message: 'hello! :D'
    });   
});

app.get('/api/weed', async(req, res) => {
    try {
        // this is a join, so that we get all the data,
        // and instead of just the type_id we have joined 
        // the type_id name from the types table to the main table
        const result = await client.query(`
        SELECT bud.*, 
        t.name as type
        FROM weed bud
        JOIN types t 
        ON bud.type_id = t.id
        ORDER BY bud.id;
        `);
        
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




