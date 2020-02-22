require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import seed data:
const strains = require('./strains.js');
const types = require('./types.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();

        //first save types and get each return row which has
        // the id of the type... notice use of RETURNING;
        const savedTypes = await Promise.all(
            types.map(async type => {
                const result = await client.query(`
                    INSERT INTO types (name)
                    VALUES ($1)
                    RETURNING *;                                
                `,
                [type]);

                return result.rows[0];
            })
        );

    
        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // map every item in the array data
            strains.map(weed => {
                
                const type = savedTypes.find(type => {
                    return type.name === weed.type;
                });
                
                return client.query(`
                    INSERT INTO weed (strain, type_id, smell, thc, outdoor, indoor, imgUrl)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
                [weed.strain, type.id, weed.smell, weed.thc, weed.outdoor, weed.indoor, weed.imgUrl]);

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
