require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

/* ROUTES */

const authorsRoutes = require("./src/routes/authors");
const datasetsRoutes = require("./src/routes/datasets");
const identifiersRoutes = require("./src/routes/identifiers");
const apiRoutes = require("./src/routes/api");

/* MIDDLEWARE */

const errorHandler = require("./src/middleware/errorHandler");
const notFound = require("./src/middleware/notFound");

const layout = require("./src/views/layout");

const app = express();

/* ================================
MIDDLEWARE
================================ */

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(morgan("dev"));

/* ================================
ROUTES
================================ */

app.use("/", authorsRoutes);
app.use("/", datasetsRoutes);
app.use("/", identifiersRoutes);

/* API ROUTES */

app.use("/", apiRoutes);

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
))

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
