function generateIdentifier(type, id){

let prefix = "RES";

if(type === "author") prefix = "RES-AUTH";
if(type === "dataset") prefix = "RES-DATA";
if(type === "paper") prefix = "RES-PAPR";

const num = String(id).padStart(5,"0");

return `${prefix}-${num}`;

}

module.exports = generateIdentifier;
