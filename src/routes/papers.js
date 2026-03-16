const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const generateIdentifier = require("../utils/idGenerator");
const identifierService = require("../services/identifierService");

const layout = require("../views/layout");

/* ===============================
HELPER
=============================== */

function escapeHTML(str){
return String(str || "")
.replace(/&/g,"&amp;")
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
.replace(/"/g,"&quot;");
}

/* ===============================
CREATE PAPER PAGE
=============================== */

router.get("/create-paper",(req,res)=>{

res.send(layout(
"Create Paper",
`

<h2>Register Research Paper</h2>

<form method="POST" action="/create-paper">

<label>Title</label><br>
<input name="title" required style="width:400px"><br><br>

<label>Authors</label><br>
<input name="authors" required style="width:400px"><br><br>

<label>Journal</label><br>
<input name="journal" style="width:300px"><br><br>

<label>Year</label><br>
<input name="year" style="width:120px"><br><br>

<label>DOI</label><br>
<input name="doi" style="width:400px"><br><br>

<label>URL</label><br>
<input name="url" style="width:400px"><br><br>

<button class="btn">Register Paper</button>

</form>

`
));

});


/* ===============================
CREATE PAPER
=============================== */

router.post("/create-paper", async (req,res)=>{

try{

const {title,authors,journal,year,doi,url} = req.body;

/* VALIDATION */

if(!title || !authors){

return res.send(layout("Error","Title and Authors required"));

}

/* GENERATE IDENTIFIER */

const identifier = await generateIdentifier("PAPR");

/* INSERT PAPER */

await pool.query(

`INSERT INTO papers
(title,authors,journal,year,doi,url,identifier)
VALUES ($1,$2,$3,$4,$5,$6,$7)`,

[title,authors,journal,year,doi,url,identifier]

);

/* REGISTER IDENTIFIER */

await identifierService.register(identifier,"PAPR");

/* SUCCESS */

res.send(layout(
"Paper Registered",
`

<h2>Paper Registered Successfully</h2>

<p><b>Identifier:</b> ${identifier}</p>

<a class="btn" href="/paper/${identifier}">
View Paper
</a>

<br><br>

<a href="/browse-papers">
Browse Papers
</a>

`
));

}catch(err){

console.error(err);

res.send(layout(
"Error",
`Paper registration failed`
));

}

});


/* ===============================
PAPER PROFILE
=============================== */

router.get("/paper/:identifier", async (req,res)=>{

try{

const {identifier} = req.params;

const result = await pool.query(

"SELECT * FROM papers WHERE identifier=$1",
[identifier]

);

if(result.rows.length===0){

return res.send(layout("Not Found","Paper not found"));

}

const p = result.rows[0];

res.send(layout(
p.title,
`

<h2>${escapeHTML(p.title)}</h2>

<p><b>Authors:</b> ${escapeHTML(p.authors)}</p>

<p><b>Journal:</b> ${escapeHTML(p.journal)}</p>

<p><b>Year:</b> ${escapeHTML(p.year)}</p>

<p><b>Identifier:</b> ${escapeHTML(p.identifier)}</p>

<p>
<b>DOI:</b>
<a href="${escapeHTML(p.doi)}" target="_blank">
${escapeHTML(p.doi)}
</a>
</p>

<p>
<b>URL:</b>
<a href="${escapeHTML(p.url)}" target="_blank">
${escapeHTML(p.url)}
</a>
</p>

`
));

}catch(err){

console.error(err);

res.send(layout("Error","Unable to load paper"));

}

});


/* ===============================
BROWSE PAPERS
=============================== */

router.get("/browse-papers", async (req,res)=>{

try{

const result = await pool.query(

"SELECT * FROM papers ORDER BY id DESC LIMIT 100"

);

let rows="";

result.rows.forEach(p=>{

rows += `

<tr>

<td>${escapeHTML(p.identifier)}</td>

<td>${escapeHTML(p.title)}</td>

<td>${escapeHTML(p.journal)}</td>

<td>${escapeHTML(p.year)}</td>

<td>
<a href="/paper/${p.identifier}">
View
</a>
</td>

</tr>

`;

});

res.send(layout(
"Browse Papers",
`

<h2>Research Papers</h2>

<table border="1" cellpadding="8">

<tr>
<th>Identifier</th>
<th>Title</th>
<th>Journal</th>
<th>Year</th>
<th>Link</th>
</tr>

${rows}

</table>

`
));

}catch(err){

console.error(err);

res.send(layout("Error","Unable to load papers"));

}

});


module.exports = router;
