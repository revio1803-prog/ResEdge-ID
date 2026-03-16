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
<input name="q" placeholder="Search authors, datasets or papers">
<button class="btn">Search</button>
</form>
`
))

}

try{

/* AUTHORS */

const authors = await pool.query(
"SELECT * FROM authors WHERE name ILIKE $1 LIMIT 20",
["%"+q+"%"]
);

/* DATASETS */

const datasets = await pool.query(
"SELECT * FROM datasets WHERE title ILIKE $1 LIMIT 20",
["%"+q+"%"]
);

/* PAPERS */

const papers = await pool.query(
"SELECT * FROM papers WHERE title ILIKE $1 LIMIT 20",
["%"+q+"%"]
);

let results="";

/* AUTHORS RESULTS */

if(authors.rows.length){

results += `<h3>Authors</h3>`;

authors.rows.forEach(a=>{

results += `
<p>
Author: <a href="/author/${a.identifier}">
${a.name}
</a>
</p>
`;

});

}

/* DATASETS RESULTS */

if(datasets.rows.length){

results += `<h3>Datasets</h3>`;

datasets.rows.forEach(d=>{

results += `
<p>
Dataset: <a href="/dataset/${d.identifier}">
${d.title}
</a>
</p>
`;

});

}

/* PAPERS RESULTS */

if(papers.rows.length){

results += `<h3>Papers</h3>`;

papers.rows.forEach(p=>{

results += `
<p>
Paper: <a href="/paper/${p.identifier}">
${p.title}
</a>
</p>
`;

});

}

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
