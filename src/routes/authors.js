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

router.get("/create-author",(req,res)=>{

res.send(layout(
"Create Author",
`
<h2>Create Author</h2>

<form method="POST" action="/create-author">

<label>Name</label><br>
<input name="name" required><br><br>

<label>Institution</label><br>
<input name="institution"><br><br>

<button class="btn">Create Author</button>

const generateIdentifier = require("../utils/idGenerator");

router.post("/create-author",async(req,res)=>{

try{

const {name,institution} = req.body;

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

console.error(err)
res.status(500).send("Server Error")

}

})

</form>
`
))

})
