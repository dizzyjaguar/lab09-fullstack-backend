require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import seed data:
const data = require('./seed-data.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();
    
        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // map every item in the array data
            data.map(weed => {
                return client.query(`
                    INSERT INTO weed (strain, type, smell, thc, outdoor, indoor)
                    VALUES ($1, $2, $3, $4, $5, %6);
                `,
                [weed.strain, weed.type, weed.smell, weed.thc, weed.outdoor, weed.indoor]);

                // Use a "parameterized query" to insert the data,
                // Don't forget to "return" the client.query promise!
                
            })
        );

        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }
    
}
