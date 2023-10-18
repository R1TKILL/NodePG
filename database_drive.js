const pg = require('pg')

const CLIENT = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'NodeProducts',
    password: '123',
    port: 5432
})

module.exports = CLIENT