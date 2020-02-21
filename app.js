// load environment variables
require('dotenv').config

// dependecies
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const pg = require('pg')

//database client
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();

//application setup
const app = express()
const PORT = process.env.PORT;
app.use(morgan('dev'));
app.use(cors());

//API ROUTES






// start server
app.listen(PORT, () => {
    console.log('the server is running :D on PORT' PORT)
})





