const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");

router.get("/search", async (req,res)=>{

const q = req.query.q || "";

if(!q){

return res.send(layout(
"Search",
`
<h2>Search</h2>

<form>
<input name="q" placeholder="Search authors or datasets">
<button class="btn">Search</button>
</form>
`
))

}

try{

const authors = await pool.query(
"SELECT * FROM authors WHERE name ILIKE $1",
["%"+q+"%"]
);

const datasets = await pool.query(
"SELECT * FROM datasets WHERE title ILIKE $1",
["%"+q+"%"]
);

let results="";

authors.rows.forEach(a=>{

results += `
<p>
Author: <a href="/author/${a.identifier}">
${a.name}
</a>
</p>
`;

});

datasets.rows.forEach(d=>{

results += `
<p>
Dataset: <a href="/dataset/${d.identifier}">
${d.title}
</a>
</p>
`;

});

res.send(layout(
"Search",
`
<h2>Search Results</h2>

<form>
<input name="q" value="${q}">
<button class="btn">Search</button>
</form>

<br>

${results || "No results found"}
`
))

}catch(err){

console.error(err)
res.status(500).send("Server Error")

}

})

module.exports = router;
