const { Pool } = require("pg");

const pool = new Pool({
connectionString: process.env.DATABASE_URL,
ssl: {
rejectUnauthorized: false
}
});

/* ==============================
AUTO CREATE TABLES
============================== */

async function initDB(){

try{

/* AUTHORS */

await pool.query(`
CREATE TABLE IF NOT EXISTS authors (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
institution TEXT,
identifier TEXT UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

/* DATASETS */

await pool.query(`
CREATE TABLE IF NOT EXISTS datasets (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
publisher TEXT,
year TEXT,
identifier TEXT UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

/* IDENTIFIERS */

await pool.query(`
CREATE TABLE IF NOT EXISTS identifiers (
id SERIAL PRIMARY KEY,
identifier TEXT UNIQUE,
prefix TEXT DEFAULT '10.1001',
type TEXT,
number INTEGER DEFAULT 0,
target_url TEXT,
metadata JSONB,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

console.log("Database ready");

}catch(err){

console.error("Database init error:", err);

}

}

initDB();

module.exports = pool;
