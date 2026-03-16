require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const app = express();

/* DATABASE */

const pool = require("./src/config/db");

/* ROUTES */

const authorsRoutes = require("./src/routes/authors");
const datasetsRoutes = require("./src/routes/datasets");
const identifiersRoutes = require("./src/routes/identifiers");
const apiRoutes = require("./src/routes/api");

/* MIDDLEWARE */

const errorHandler = require("./src/middleware/errorHandler");
const notFound = require("./src/middleware/notFound");

const layout = require("./src/views/layout");

/* ================================
MIDDLEWARE
================================ */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ================================
ROUTES (ORDER IMPORTANT)
================================ */

app.use("/", authorsRoutes);
app.use("/", datasetsRoutes);
app.use("/", apiRoutes);

/* identifier resolver LAST */

app.use("/", identifiersRoutes);

/* ================================
DEBUG ROUTE
================================ */

app.get("/debug-authors", async (req,res)=>{

try{

const result = await pool.query("SELECT * FROM authors");

res.json(result.rows);

}catch(err){

console.error(err);
res.send(err.message);

}

});

/* ================================
DATABASE CLEANUP
================================ */

app.get("/cleanup-old-identifiers", async (req,res)=>{

try{

await pool.query(`
DELETE FROM authors
WHERE identifier LIKE 'RES-%'
`);

await pool.query(`
DELETE FROM identifiers
WHERE identifier LIKE 'RES-%'
`);

res.send("Old identifiers removed");

}catch(err){

console.error(err);
res.send(err.message);

}

});

/* ================================
HOME PAGE
================================ */

app.get("/", (req,res)=>{

res.send(layout(
"Research Edge Identifier",
`

<h2>Research Edge Identifier Registry</h2>

<p>
This platform provides persistent identifiers for research authors,
datasets and research publications.
</p>

<br>

<a class="btn" href="/browse-authors">Browse Authors</a>
<a class="btn" href="/browse-datasets">Browse Datasets</a>

<br><br>

<a class="btn" href="/create-author">Create Author</a>
<a class="btn" href="/create-dataset">Create Dataset</a>

`
));

});

/* ================================
DATABASE UPDATE
================================ */

app.get("/update-db", async (req,res)=>{

try{

await pool.query(`
ALTER TABLE authors
ADD COLUMN IF NOT EXISTS identifier TEXT
`);

await pool.query(`
ALTER TABLE datasets
ADD COLUMN IF NOT EXISTS identifier TEXT
`);

await pool.query(`
ALTER TABLE datasets
ADD COLUMN IF NOT EXISTS publisher TEXT
`);

await pool.query(`
ALTER TABLE datasets
ADD COLUMN IF NOT EXISTS year TEXT
`);

await pool.query(`
ALTER TABLE identifiers
ADD COLUMN IF NOT EXISTS prefix TEXT DEFAULT '10.1001'
`);

await pool.query(`
ALTER TABLE identifiers
ADD COLUMN IF NOT EXISTS number INTEGER DEFAULT 0
`);

res.send("Database updated successfully");

}catch(err){

console.error(err);
res.send(err.message);

}

});

/* ================================
ERROR HANDLING
================================ */

app.use(notFound);
app.use(errorHandler);

/* ================================
SERVER START
================================ */

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{

console.log("Server running on port " + PORT);

});
