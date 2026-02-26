const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function init() {
    console.log("Connecting to database...");
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Power2026!Secure#99',
        multipleStatements: true
    });

    console.log("Connected successfully. Reading schema...");
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
        console.error("schema.sql not found at " + schemaPath);
        process.exit(1);
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log("Applying schema...");
    await connection.query(schema);

    console.log("Database initialized successfully!");
    console.log("The users, products, and orders tables have been created or updated.");
    process.exit(0);
}

init().catch(err => {
    console.error("Failed to initialize database:", err);
    process.exit(1);
});
