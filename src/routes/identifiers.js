const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");

/* ===============================
IDENTIFIER RESOLVER
=============================== */

router.get("/id/:identifier", async (req,res)=>{

try{

const {identifier} = req.params;

/* find identifier */

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

/* page content */

res.send(layout(
"Identifier "+identifier,
`
<h2>Identifier Record</h2>

<p><b>Identifier:</b> ${data.identifier}</p>

<p><b>Type:</b> ${data.type}</p>

<p><b>Target URL:</b> ${data.target_url || "Not available"}</p>

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

router.get("/identifier/:identifier", async (req,res)=>{

try{

const {identifier} = req.params;

const result = await pool.query(
"SELECT * FROM identifiers WHERE identifier=$1",
[identifier]
);

if(result.rows.length === 0){

return res.status(404).json({
error:"Identifier not found"
});

}

res.json(result.rows[0]);

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

}

});

module.exports = router;
