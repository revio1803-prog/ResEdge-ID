const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/id/:identifier", async (req, res) => {

  try {

    const { identifier } = req.params;

    const result = await pool.query(
      "SELECT * FROM identifiers WHERE identifier=$1",
      [identifier]
    );

    if (result.rows.length === 0) {

      return res.status(404).send("Identifier not found");

    }

    const data = result.rows[0];

    res.json(data);

  } catch (err) {

    console.error(err);
    res.status(500).send("Server error");

  }

});

module.exports = router;
