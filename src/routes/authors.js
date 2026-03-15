const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");
const generateIdentifier = require("../utils/idGenerator");

/* ===============================
BROWSE AUTHORS
=============================== */

router.get("/browse-authors", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM authors ORDER BY id DESC LIMIT 50"
);

let rows="";

if(result.rows.length === 0){

rows = `
<tr>
<td colspan="4">No authors registered yet</td>
</tr>
`;

}else{

result.rows.forEach(a=>{

rows += `
<tr>
<td>${a.id}</td>
<td>${a.name || ""}</td>
<td>${a.institution || ""}</td>
<td>${a.identifier || ""}</td>
</tr>
`;

});

}

res.send(layout(
"Authors",
`
<h2>Registered Authors</h2>

<a class="btn" href="/create-author">Create Author</a>

<table>

<tr>
<th>ID</th>
<th>Name</th>
<th>Institution</th>
<th>Identifier</th>
</tr>

${rows}

</table>
`
));

}catch(err){

console.error("Browse authors error:",err);
res.status(500).send("Server Error");

}

});


/* ===============================
CREATE AUTHOR FORM
=============================== */

router.get("/create-author",(req,res)=>{

res.send(layout(
"Create Author",
`
<h2>Create Author</h2>

<form method="POST" action="/create-author">

<label>Name</label>
<input name="name" required>

<label>Institution</label>
<input name="institution">

<br>

<button class="btn">Create Author</button>

</form>
`
));

});


/* ===============================
CREATE AUTHOR POST
=============================== */

router.post("/create-author", async (req,res)=>{

try{

const {name,institution} = req.body;

if(!name){
return res.status(400).send("Name is required");
}

const insert = await pool.query(
"INSERT INTO authors(name,institution) VALUES($1,$2) RETURNING id",
[name,institution]
);

const id = insert.rows[0].id;

const identifier = generateIdentifier("author",id);

await pool.query(
"UPDATE authors SET identifier=$1 WHERE id=$2",
[identifier,id]
);

res.redirect("/browse-authors");

}catch(err){

console.error("Create author error:",err);
res.status(500).send("Server Error");

}

});


module.exports = router;
