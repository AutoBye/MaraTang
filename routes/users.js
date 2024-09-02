const express = require('express');
const router = express.Router();

//db
const mysql      = require('mysql');
const dbconfig   = require('./../config/database');
const connection = mysql.createConnection(dbconfig);

/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * from account', (error, rows) => {
    if (error) throw error;
    console.log('User info is: ', rows);
    res.send(rows);
  });
});

module.exports = router;
