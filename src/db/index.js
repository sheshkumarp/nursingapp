const {Pool} = require('pg')
const { DB_USER, DB_PASSWORD, DB_HOST, DB_DATABBASE, DB_PORT } = require('../constants')

const pool = new Pool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    database: DB_DATABBASE,
    port:DB_PORT
})

module.exports = {
    query: (text, params) => {
        return pool.query(text, params);
    }
}