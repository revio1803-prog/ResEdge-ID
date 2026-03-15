require("dotenv").config();

const express = require("express");
const morgan = require("morgan");

const authorsRoutes = require("./src/routes/authors");
const datasetsRoutes = require("./src/routes/datasets");
const identifiersRoutes = require("./src/routes/identifiers");

const errorHandler = require("./src/middleware/errorHandler");
const notFound = require("./src/middleware/notFound");

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/", authorsRoutes);
app.use("/", datasetsRoutes);
app.use("/", identifiersRoutes);

app.get("/", (req, res) => {
  res.send("Research Edge Identifier Server Running");
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
