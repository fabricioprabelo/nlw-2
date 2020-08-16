import path from 'path';
import 'dotenv/config';

require('ts-node/register');

module.exports = {
    client: "sqlite3",
    connection: {
        filename: path.resolve(__dirname, "src", "database", "database.sqlite")
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: path.resolve(__dirname, "src", "database", "migrations")
    },
    useNullAsDefault: true,
    timezone: 'America/Sao_Paulo'
}