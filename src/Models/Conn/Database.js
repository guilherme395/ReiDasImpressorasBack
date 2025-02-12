require("dotenv").config();
const knex = require("knex");

class Database {
    constructor() {
        this.connection = knex({
            client: process.env.DB_CLIENT,
            connection: {
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_NAME
            },
            useNullAsDefault: true
        });
        this.testConnection();
    }

    async testConnection() {
        try {
            await this.connection.raw("SELECT 1");
            console.log("Conexão com o banco de dados bem-sucedida.");
        } catch (err) {
            console.error("Erro ao conectar ao banco de dados:", err.message);
            process.exit(1);
        }
    }

    getConnection() {
        return this.connection;
    }
}

module.exports = new Database().getConnection();