const express = require("express");
const router = express.Router();

const pool = require("../config/db");

/* ================================
GET AUTHORS API
================================ */

router.get("/api/authors", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM authors ORDER BY id DESC LIMIT 100"
);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

}

});

/* ================================
GET DATASETS API
================================ */

router.get("/api/datasets", async (req,res)=>{

try{

const result = await pool.query(
"SELECT * FROM datasets ORDER BY id DESC LIMIT 100"
);

res.json(result.rows);

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

}

});

/* ================================
IDENTIFIER API
================================ */

router.get("/api/identifier/:id", async (req,res)=>{

try{

const {id} = req.params;

const result = await pool.query(
"SELECT * FROM identifiers WHERE identifier=$1",
[id]
);

if(result.rows.length === 0){

return res.status(404).json({error:"Identifier not found"});

}

res.json(result.rows[0]);

}catch(err){

console.error(err);
res.status(500).json({error:"Server error"});

}

});

module.exports = router;
