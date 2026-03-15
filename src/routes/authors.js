const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/browse-authors", async (req, res) => {

  try {

    const result = await pool.query(
      "SELECT * FROM authors ORDER BY id DESC LIMIT 50"
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);
    res.status(500).send("Server error");

  }

});

module.exports = router;
