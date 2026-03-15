const pool = require("../config/db");

async function generateIdentifier(type){

let prefix = "10.1001";
let code = "";

if(type === "author") code = "AUTH";
if(type === "dataset") code = "DATA";
if(type === "paper") code = "PAPR";

const result = await pool.query(
`SELECT COUNT(*) FROM identifiers WHERE type=$1`,
[type]
);

let number = parseInt(result.rows[0].count) + 1;

let numberStr = String(number).padStart(5,"0");

let identifier = `${prefix}/${code}${numberStr}`;

return identifier;

}

module.exports = generateIdentifier;
