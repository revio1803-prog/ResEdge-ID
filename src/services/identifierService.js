const generateId = require("../utils/idGenerator");

function createIdentifier(type, number) {

  let prefix = "RES";

  if (type === "author") prefix = "AUTH";
  if (type === "dataset") prefix = "DATA";
  if (type === "paper") prefix = "PAPR";

  return generateId(prefix, number);
}

module.exports = createIdentifier;
