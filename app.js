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

app.use(morgan('dev')); //http logging
app.use(cors()); // enable CORS request
app.use(express.static('public')); // server files from /public folder, i think this is for if you have photos in your repository
app.use(express.json()); // enable reading incoming json data
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



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

//types route
app.get('/api/type', async (req, res ) => {
    try {
        const result = await client.query(`
        SELECT *
        FROM types
        ORDER BY name; 
        `);

        res.json(result.rows);
    }
    // eslint-disable-next-line keyword-spacing
    catch(err) {
        console.log(err);
        res.status(500).json({
            error:err.message || err
        });
    }
});

//POST route so we can post data to the database from our React Form
app.post('/api/weed', async(req, res) => {
    // using req.body instead of req.params or req.query, both of which belong to GET requests
    try {
        console.log(req.body);
        // create a new weed entry that comes in the req.body
        const result = await client.query(`
            INSERT INTO weed (strain, type_id, smell, thc, outdoor, indoor, imgUrl)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;    
        `,
        // pass the values in an array so that pg.Client can sanitize them
        [req.body.strain, req.body.typeId, req.body.smell, req.body.thc, req.body.outdoor, req.body.indoor, req.body.imgUrl]
        );

        // return just the first result of the query
        res.json(result.rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

//showing the details of an indiivdual item from the database 
app.get('/api/weed/:myWeedId', async(req, res) => {
    try {
        const result = await client.query(`
        SELECT *
        FROM weed 
        WHERE weed.id=$1`,
         // the second parameter is an array of values to be SANITIZED then inserted into the query
        // i only know this because of the `pg` docs
        [req.params.myWeedId]);
        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error:err.message || err
        });
    }
});


//strain, type_id, smell, thc, outdoor, indoor, imgUrl

//Update Route
app.put('/api/weed', async(req, res) => {
    try {
        const result = await client.query(`
            UPDATE weed
            SET strain = '${req.body.name}',
                type_id = '${req.body.type_id}',
                smell = '${req.body.smell}',
                thc = '${req.body.thc}',
                outdoor = '${req.body.outdoor}',
                indoor = '${req.body.indoor}',
                imgUrl = '${req.body.imgUrl}'
            WHERE id = ${req.body.id};
        `,
        );
        res.json(result.rows[0]); // return just the first result of our query
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});






// this declaring port as our environment variable or just port 3000
const port = process.env.PORT || 3000;

// start server
app.listen(port, () => {
    console.log('the server is running :D on PORT', port);
});

module.exports = {
    app: app,
};




