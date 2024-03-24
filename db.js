/** Database setup for BizTime. */

const { Client } = require("pg");

let db = new Client({
    user: "korb",
    password: "123",
    host: "localhost",
    port: 5432,
    database: "biztime"





    //connectionString: "postgresql:///biztime"
});

db.connect();


module.exports = db;