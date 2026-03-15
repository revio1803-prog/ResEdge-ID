function generateId(prefix, number) {
  const num = String(number).padStart(5, "0");
  return `${prefix}${num}`;
}

module.exports = generateId;
