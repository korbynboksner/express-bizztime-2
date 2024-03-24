const express = require('express');

const router = new express.Router();

const db = require('../db')



/** (Fixed) Get users: [user, user, user] */

router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
            `SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices`);
  
      return res.json(results.rows);
    }
  
    catch (err) {
      return next(err);
    }
  });

router.get("/:id", async function (req, res, next) {
    try {
        const id = req.params.id;
        const results = await db.query(
            `SELECT i.id, 
                  i.comp_code, 
                  i.amt, 
                  i.paid, 
                  i.add_date, 
                  i.paid_date, 
                  c.name, 
                  c.description 
            FROM invoices AS i
              INNER JOIN companies AS c ON (i.comp_code = c.code)  
            WHERE id = $1`,
             [id]);
  
      return res.json(results.rows);
    }
  
    catch (err) {
      return next(err);
    }
  });

router.post("/", async function (req, res, next) {
    try {
      const { name, description } = req.body;
  
      const result = await db.query(
            `INSERT INTO invoices (name, code) 
             VALUES ($1, $2)
             RETURNING code, name, description`,
          [name, description]
      );
  
      return res.status(201).json(result.rows[0]);
    }
  
    catch (err) {
      return next(err);
    }
  });





router.put("/:id", async function (req, res, next) {
    try {
      const { name, description } = req.body;
  
      const result = await db.query(
            `UPDATE companies SET name=$1, description=$2
             WHERE id = $3
             RETURNING code, name, description`,
          [name, description, req.params.id]
      );
  
      return res.json(result.rows[0]);
    }
  
    catch (err) {
      return next(err);
    }
  });

router.delete("/:id", async function (req, res, next) {
  try {
    const result = await db.query(
        "DELETE FROM companies WHERE id = $1",
        [req.params.id]
    );

    return res.json({"status": "Deleted"});
  }

  catch (err) {
    return next(err);
  }
});






module.exports = router;