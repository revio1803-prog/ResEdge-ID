const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");

router.get("/browse-datasets", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM datasets ORDER BY id DESC LIMIT 50"
);

let rows = "";

result.rows.forEach(d=>{

rows += `
<tr>
<td>${d.id}</td>
<td>${d.title || ""}</td>
<td>${d.year || ""}</td>
<td>${d.identifier || ""}</td>
</tr>
`;

});

res.send(layout(
"Datasets",
`
<h2>Registered Datasets</h2>

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
))

}catch(err){

console.error(err)
res.status(500).send("Server Error")

}

})

module.exports = router
