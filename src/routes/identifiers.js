const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");

/* ===============================
IDENTIFIER LANDING PAGE
=============================== */

router.get("/id/:identifier", async (req,res)=>{

try{

let {identifier} = req.params;

identifier = identifier.trim().toUpperCase();

const result = await pool.query(
"SELECT * FROM identifiers WHERE identifier=$1",
[identifier]
);

if(result.rows.length === 0){

return res.send(layout(
"Identifier Not Found",
`
<h2>Identifier Not Found</h2>

<p>
The requested identifier <b>${identifier}</b> does not exist in this registry.
</p>

<a class="btn" href="/">Back to Home</a>
`
));

}

const data = result.rows[0];

res.send(layout(
"Identifier "+identifier,
`

<h2>Identifier Landing Page</h2>

<table>

<tr>
<th>Field</th>
<th>Value</th>
</tr>

<tr>
<td>Identifier</td>
<td>${data.identifier}</td>
</tr>

<tr>
<td>Type</td>
<td>${data.type}</td>
</tr>

<tr>
<td>Target Resource</td>
<td>${data.target_url || ""}</td>
</tr>

<tr>
<td>Created</td>
<td>${data.created_at || ""}</td>
</tr>

</table>

<br>

${data.target_url ? `
<a class="btn" href="${data.target_url}">
Open Resource
</a>
` : ""}

`
));

}catch(err){

console.error("Identifier resolver error:",err);

res.status(500).send("Server Error");

}

});


/* ===============================
IDENTIFIER METADATA API
=============================== */

router.get("/api/identifier/:identifier", async (req,res)=>{

try{

let {identifier} = req.params;

identifier = identifier.trim().toUpperCase();

const result = await pool.query(
"SELECT * FROM identifiers WHERE identifier=$1",
[identifier]
);

if(result.rows.length === 0){

return res.status(404).json({
error:"Identifier not found"
});

}

const data = result.rows[0];

res.json({
identifier: data.identifier,
type: data.type,
target_url: data.target_url,
metadata: data.metadata || {},
created_at: data.created_at
});

}catch(err){

console.error(err);

res.status(500).json({
error:"Server error"
});

}

});


module.exports = router;
