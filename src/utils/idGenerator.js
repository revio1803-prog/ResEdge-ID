const pool = require("../config/db");

async function generateIdentifier(type){

try{

const prefix = "10.1001";

let code;

if(type === "author") code = "AUTH";
else if(type === "dataset") code = "DATA";
else if(type === "paper") code = "paper";
else throw new Error("Invalid identifier type");

/* find last number */

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

/* format number */

const numberStr = String(nextNumber).padStart(5,"0");

/* final identifier */

const identifier = `${prefix}/${code}${numberStr}`;

return {
identifier: identifier,
prefix: prefix,
number: nextNumber,
type: code
};

}catch(err){

console.error("Identifier generation error:", err);
throw err;

}

}

module.exports = generateIdentifier;
