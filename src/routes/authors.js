const express = require("express");
const router = express.Router();

const pool = require("../config/db");
const layout = require("../views/layout");

router.get("/browse-authors", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM authors ORDER BY id DESC LIMIT 50"
);

let rows = "";

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

res.send(layout(
"Authors",
`
<h2>Registered Authors</h2>

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
))

}catch(err){

console.error(err)
res.status(500).send("Server Error")

}

})

module.exports = router
