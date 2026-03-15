const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/browse-authors", async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM authors ORDER BY id DESC LIMIT 50"
    );

    let rows = "";

    result.rows.forEach(a => {

      rows += `
      <tr>
        <td>${a.id}</td>
        <td>${a.name}</td>
        <td>${a.institution || ""}</td>
        <td>${a.identifier || ""}</td>
      </tr>
      `;

    });

    res.send(`
      <h2>Authors</h2>
      <table border="1" cellpadding="5">
      <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Institution</th>
      <th>Identifier</th>
      </tr>
      ${rows}
      </table>
    `);

  } catch (err) {

    console.error(err);
    res.status(500).send("Server error");

  }
});

module.exports = router;
