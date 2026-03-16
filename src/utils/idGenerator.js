const pool = require("../config/db");

async function generateIdentifier(type){

try{

const prefix = "10.1001";

let code;

/* TYPE MAPPING */

if(type === "author") code = "AUTH";
else if(type === "dataset") code = "DATA";
else if(type === "paper") code = "PAPR";
else throw new Error("Invalid identifier type");

/* FIND LAST NUMBER */

const result = await pool.query(
`SELECT number FROM identifiers
WHERE type=$1
ORDER BY number DESC
LIMIT 1`,
[code]
);

let nextNumber = 1;

if(result.rows.length > 0){
nextNumber = result.rows[0].number + 1;
}

/* FORMAT NUMBER */

const numberStr = String(nextNumber).padStart(5,"0");

/* FINAL IDENTIFIER */

const identifier = `${prefix}/${code}${numberStr}`;

/* RETURN FULL DATA */

return {
identifier,
prefix,
number: nextNumber,
type: code
};

}catch(err){

console.error("Identifier generation error:", err);
throw err;

}

}

module.exports = generateIdentifier;
