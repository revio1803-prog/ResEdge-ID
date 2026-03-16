const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const generateIdentifier = require("../utils/idGenerator");
const identifierService = require("../services/identifierService");

const layout = require("../views/layout");

/* CREATE PAPER PAGE */

router.get("/create-paper",(req,res)=>{

res.send(layout(`
<h2>Create Paper</h2>

<form method="POST" action="/create-paper">

<input name="title" placeholder="Title" required><br><br>

<input name="authors" placeholder="Authors" required><br><br>

<input name="journal" placeholder="Journal"><br><br>

<input name="year" placeholder="Year"><br><br>

<input name="doi" placeholder="DOI"><br><br>

<input name="url" placeholder="URL"><br><br>

<button type="submit">Register Paper</button>

</form>
`));

});


/* CREATE PAPER */

router.post("/create-paper", async (req,res)=>{

try{

const {title,authors,journal,year,doi,url} = req.body;

const identifier = await generateIdentifier("PAPR");

/* save paper */

await pool.query(
`INSERT INTO papers
(title,authors,journal,year,doi,url,identifier)
VALUES ($1,$2,$3,$4,$5,$6,$7)`,
[title,authors,journal,year,doi,url,identifier]
);

/* identifier registry entry */

await identifierService.register(identifier,"PAPR");

/* success page */

res.send(layout(`
<h2>Paper Registered</h2>

<p><b>Identifier:</b> ${identifier}</p>

<a href="/paper/${identifier}">View Paper</a>

`));

}catch(err){

console.error(err);
res.send("Error creating paper");

}

});


/* PAPER PROFILE */

router.get("/paper/:identifier", async (req,res)=>{

try{

const {identifier} = req.params;

const result = await pool.query(
"SELECT * FROM papers WHERE identifier=$1",
[identifier]
);

if(result.rows.length===0){

return res.send("Paper not found");

}

const p = result.rows[0];

res.send(layout(`

<h2>${p.title}</h2>

<p><b>Authors:</b> ${p.authors}</p>

<p><b>Journal:</b> ${p.journal}</p>

<p><b>Year:</b> ${p.year}</p>

<p><b>Identifier:</b> ${p.identifier}</p>

<p><b>DOI:</b> <a href="${p.doi}">${p.doi}</a></p>

`));

}catch(err){

console.error(err);
res.send("Error");

}

});


/* BROWSE PAPERS */

router.get("/browse-papers", async (req,res)=>{

const result = await pool.query(
"SELECT * FROM papers ORDER BY id DESC LIMIT 50"
);

let rows="";

result.rows.forEach(p=>{

rows += `
<tr>
<td>${p.identifier}</td>
<td>${p.title}</td>
<td>${p.journal}</td>
<td>${p.year}</td>
<td><a href="/paper/${p.identifier}">View</a></td>
</tr>
`;

});

res.send(layout(`

<h2>Browse Papers</h2>

<table border="1">

<tr>
<th>Identifier</th>
<th>Title</th>
<th>Journal</th>
<th>Year</th>
<th>Link</th>
</tr>

${rows}

</table>

`));

});

module.exports = router;
