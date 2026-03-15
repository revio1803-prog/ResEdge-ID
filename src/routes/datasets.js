const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");
const generateIdentifier = require("../utils/idGenerator");

/* ===============================
BROWSE DATASETS
=============================== */

router.get("/browse-datasets", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM datasets ORDER BY id DESC LIMIT 50"
);

let rows="";

if(result.rows.length === 0){

rows = `
<tr>
<td colspan="4">No datasets registered yet</td>
</tr>
`;

}else{

result.rows.forEach(d=>{

rows += `
<tr>
<td>${d.id}</td>
<td>${d.title || ""}</td>
<td>${d.year || ""}</td>
<td>
<a href="/dataset/${d.identifier}">
${d.identifier || ""}
</a>
</td>
</tr>
`;

});

}

res.send(layout(
"Datasets",
`
<h2>Registered Datasets</h2>

<a class="btn" href="/create-dataset">Create Dataset</a>

<table>

<tr>
<th>ID</th>
<th>Title</th>
<th>Year</th>
<th>Identifier</th>
</tr>

${rows}

</table>
`
));

}catch(err){

console.error(err)
res.status(500).send("Server Error")

}

});


/* ===============================
DATASET PROFILE PAGE
=============================== */

router.get("/dataset/:identifier", async (req,res)=>{

try{

const {identifier} = req.params;

const result = await pool.query(
"SELECT * FROM datasets WHERE identifier=$1",
[identifier]
);

if(result.rows.length === 0){

return res.send(layout(
"Dataset",
`
<h2>Dataset Not Found</h2>
<p>No dataset exists with identifier <b>${identifier}</b></p>
`
))

}

const d = result.rows[0];

res.send(layout(
"Dataset "+d.title,
`

<h2>Dataset Profile</h2>

<table>

<tr>
<th>Field</th>
<th>Value</th>
</tr>

<tr>
<td>Title</td>
<td>${d.title}</td>
</tr>

<tr>
<td>Year</td>
<td>${d.year || ""}</td>
</tr>

<tr>
<td>Identifier</td>
<td>${d.identifier}</td>
</tr>

</table>

`
))

}catch(err){

console.error(err)
res.status(500).send("Server Error")

}

});


/* ===============================
CREATE DATASET FORM
=============================== */

router.get("/create-dataset",(req,res)=>{

res.send(layout(
"Create Dataset",
`
<h2>Create Dataset</h2>

<form method="POST" action="/create-dataset">

<label>Title</label>
<input name="title" required>

<label>Year</label>
<input name="year">

<br>

<button class="btn">Create Dataset</button>

</form>
`
))

})


/* ===============================
CREATE DATASET POST
=============================== */

router.post("/create-dataset",async(req,res)=>{

try{

const {title,year} = req.body;

const insert = await pool.query(
"INSERT INTO datasets(title,year) VALUES($1,$2) RETURNING id",
[title,year]
);

const id = insert.rows[0].id;

const identifier = generateIdentifier("dataset",id);

await pool.query(
"UPDATE datasets SET identifier=$1 WHERE id=$2",
[identifier,id]
);

await pool.query(
`INSERT INTO identifiers(identifier,type,target_url)
VALUES($1,$2,$3)`,
[
identifier,
"dataset",
"/dataset/"+identifier
]
);

res.redirect("/browse-datasets");

}catch(err){

console.error(err)
res.status(500).send("Server Error")

}

})


module.exports = router;
