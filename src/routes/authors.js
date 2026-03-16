const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");
const generateIdentifier = require("../utils/idGenerator");

/* CREATE AUTHOR PAGE */

router.get("/create-author",(req,res)=>{

res.send(layout("Create Author",`

<h2>Create Author</h2>

<form method="POST" action="/create-author">

Name
<input name="name" required>

Institution
<input name="institution">

<button>Create Author Identifier</button>

</form>

`));

});


/* CREATE AUTHOR */

router.post("/create-author", async (req,res)=>{

try{

const name = req.body.name;
const institution = req.body.institution || "";

const id = await generateIdentifier("author");

await pool.query(
`INSERT INTO authors (identifier,name,institution)
VALUES ($1,$2,$3)`,
[id.identifier,name,institution]
);

await pool.query(
`INSERT INTO identifiers
(identifier,prefix,type,number,target_url)
VALUES ($1,$2,$3,$4,$5)`,
[
id.identifier,
id.prefix,
"author",
id.number,
`/author/${id.identifier}`
]
);

res.redirect(`/author/${id.identifier}`);

}catch(err){

console.error(err);
res.send(err.message);

}

});


/* AUTHOR PROFILE */

router.get("/author/:identifier", async (req,res)=>{

try{

const identifier = req.params.identifier;

const result = await pool.query(
`SELECT * FROM authors WHERE identifier=$1`,
[identifier]
);

if(result.rows.length===0){
return res.send("Author not found");
}

const a = result.rows[0];

res.send(layout("Author Profile",`

<h2>${a.name}</h2>

<p><b>Identifier:</b> ${a.identifier}</p>

<p><b>Institution:</b> ${a.institution || ""}</p>

`));

}catch(err){

console.error(err);
res.send(err.message);

}

});


/* BROWSE AUTHORS */

router.get("/browse-authors", async (req,res)=>{

const result = await pool.query(
`SELECT * FROM authors ORDER BY created_at DESC`
);

let rows="";

result.rows.forEach(a=>{

rows+=`
<tr>
<td>${a.identifier}</td>
<td>${a.name}</td>
<td>${a.institution || ""}</td>
<td><a href="/author/${a.identifier}">View</a></td>
</tr>
`;

});

res.send(layout("Authors",`

<h2>Author Registry</h2>

<table>

<tr>
<th>Identifier</th>
<th>Name</th>
<th>Institution</th>
<th>Link</th>
</tr>

${rows}

</table>

`));

});


module.exports = router;
