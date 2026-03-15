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

await pool.query(`
CREATE TABLE IF NOT EXISTS authors (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
institution TEXT,
identifier TEXT UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS datasets (
id SERIAL PRIMARY KEY,
title TEXT NOT NULL,
year TEXT,
identifier TEXT UNIQUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

await pool.query(`
CREATE TABLE IF NOT EXISTS identifiers (
id SERIAL PRIMARY KEY,
identifier TEXT UNIQUE,
type TEXT,
target_url TEXT,
metadata JSONB,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`);

console.log("Database ready");

}catch(err){

console.error("Database init error:",err);

}

}

initDB();

module.exports = pool;
