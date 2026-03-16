const pool = require("../config/db");

async function generateIdentifier(type){

const prefix = "10.1001";

/* VALID TYPES */

const types = {
AUTH: "AUTH",
DATA: "DATA",
paper: "paper"
};

if(!types[type]){
throw new Error("Invalid identifier type");
}

const code = types[type];

/* COUNT EXISTING */

const result = await pool.query(
`SELECT COUNT(*) FROM identifiers WHERE type=$1`,
[code]
);

let number = parseInt(result.rows[0].count) + 1;

let numberStr = String(number).padStart(5,"0");

/* FINAL IDENTIFIER */

let identifier = `${prefix}/${code}${numberStr}`;

return identifier;

}

module.exports = generateIdentifier;
