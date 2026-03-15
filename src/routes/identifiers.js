const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");

router.get("/id/:identifier", async (req,res)=>{

try{

const {identifier} = req.params;

const result = await pool.query(
"SELECT * FROM identifiers WHERE identifier=$1",
[identifier]
);

if(result.rows.length === 0){

return res.send(layout(
"Identifier",
`
<h2>Identifier Not Found</h2>
<p>The requested identifier does not exist.</p>
`
))

}

const data = result.rows[0];

res.send(layout(
"Identifier",
`
<h2>Identifier Details</h2>

<p><b>Identifier:</b> ${data.identifier}</p>
<p><b>Type:</b> ${data.type}</p>
<p><b>Target URL:</b> ${data.target_url || ""}</p>

`
))

}catch(err){

console.error(err)
res.status(500).send("Server Error")

}

})

module.exports = router
