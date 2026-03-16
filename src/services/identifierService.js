const pool = require("../config/db");

async function register(identifier, type, prefix, number){

try{

await pool.query(
`INSERT INTO identifiers(identifier,type,prefix,number)
VALUES ($1,$2,$3,$4)`,
[identifier,type,prefix,number]
);

}catch(err){

console.error("Identifier register error:",err);
throw err;

}

}

module.exports = {
register
};
