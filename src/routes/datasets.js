const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");
const generateIdentifier = require("../utils/idGenerator");

/* =========================
CREATE DATASET PAGE
========================= */

router.get("/create-dataset",(req,res)=>{

res.send(layout("Create Dataset",`

<h2>Create Dataset</h2>

<form method="POST" action="/create-dataset">

Title
<input name="title" required>

Publisher
<input name="publisher">

Year
<input name="year">

<button>Create Dataset Identifier</button>

</form>

`));

});

/* =========================
CREATE DATASET
========================= */

router.post("/create-dataset", async (req,res)=>{

try{

const {title,publisher,year} = req.body;

/* generate identifier */

const id = await generateIdentifier("dataset");

/* insert dataset */

await pool.query(
`INSERT INTO datasets (identifier,title,publisher,year)
VALUES ($1,$2,$3,$4)`,
[id.identifier,title,publisher,year]
);

/* register identifier */

await pool.query(
`INSERT INTO identifiers
(identifier,prefix,type,number,target_url)
VALUES ($1,$2,$3,$4,$5)`,
[
id.identifier,
id.prefix,
"dataset",
id.number,
`/dataset/${id.identifier}`
]
);

res.send(layout("Dataset Created",`

<h2>Dataset Created</h2>

<p><b>${id.identifier}</b></p>

<a href="/dataset/${id.identifier}">
<button>Open Dataset</button>
</a>

`));

}catch(err){

console.error(err);
res.send(err.message);

}

});

/* =========================
BROWSE DATASETS
========================= */

router.get("/browse-datasets", async (req,res)=>{

try{

const result = await pool.query(
`SELECT * FROM datasets ORDER BY created_at DESC`
);

let rows="";

result.rows.forEach(d=>{

rows += `
<tr>
<td>${d.identifier}</td>
<td>${d.title}</td>
<td>${d.publisher || ""}</td>
<td><a href="/dataset/${d.identifier}">View</a></td>
</tr>
`;

});

res.send(layout("Dataset Registry",`

<h2>Dataset Registry</h2>

<table>

<tr>
<th>Identifier</th>
<th>Title</th>
<th>Publisher</th>
<th>Link</th>
</tr>

${rows}

</table>

`));

}catch(err){

console.error(err);
res.send(err.message);

}

});

/* =========================
DATASET PAGE
========================= */

router.get("/dataset/:identifier", async (req,res)=>{

try{

const {identifier} = req.params;

const result = await pool.query(
`SELECT * FROM datasets WHERE identifier=$1`,
[identifier]
);

if(result.rows.length === 0){
return res.send(layout("Not Found","Dataset not found"));
}

const d = result.rows[0];

res.send(layout("Dataset Page",`

<h2>${d.title}</h2>

<p><b>Identifier:</b> ${d.identifier}</p>

<p><b>Publisher:</b> ${d.publisher || ""}</p>

<p><b>Year:</b> ${d.year || ""}</p>

`));

}catch(err){

console.error(err);
res.send(err.message);

}

});

module.exports = router;
