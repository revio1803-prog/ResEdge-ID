const pool = require("../config/db");

async function generateIdentifier(type){

const prefix = "10.1001";

/* TYPE MAPPING */

let code;

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

return {
identifier: identifier,
prefix: prefix,
number: nextNumber,
type: code
};

}

module.exports = generateIdentifier;
