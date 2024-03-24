const express = require('express');

const slugify = require('slugify');

const router = new express.Router();

const db = require('../db')



/** (Fixed) Get users: [user, user, user] */

router.get("/", async function (req, res, next) {
    try {
      const results = await db.query(
            `SELECT code, name, description FROM companies`);
  
      return res.json(results.rows);
    }
  
    catch (err) {
      return next(err);
    }
  });

router.get("/:code", async function (req, res, next) {
    try {
        const code = req.params.code;
        const results = await db.query(
            `SELECT code, name, description
             FROM companies
             WHERE code = $1`, [code]);
  
      return res.json(results.rows);
    }
  
    catch (err) {
      return next(err);
    }
  });

router.post("/", async function (req, res, next) {
    try {
      const { name, description } = req.body;
      let code = slugify(name, {lower: true});
  
      const result = await db.query(
            `INSERT INTO companies (name, code) 
             VALUES ($1, $2, $3)
             RETURNING code, name, description`,
          [code, name, description]
      );
  
      return res.status(201).json(result.rows[0]);
    }
  
    catch (err) {
      return next(err);
    }
  });





router.put("/:code", async function (req, res, next) {
    try {
      const { name, description } = req.body;
  
      const result = await db.query(
            `UPDATE companies SET name=$1, description=$2
             WHERE code = $3
             RETURNING code, name, description`,
          [name, description, req.params.code]
      );
  
      return res.json(result.rows[0]);
    }
  
    catch (err) {
      return next(err);
    }
  });

router.delete("/:code", async function (req, res, next) {
  try {
    const result = await db.query(
        "DELETE FROM companies WHERE code = $1",
        [req.params.code]
    );

    return res.json({"status": "Deleted"});
  }

  catch (err) {
    return next(err);
  }
});






module.exports = router;