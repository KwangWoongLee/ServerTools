'use strict';

const express = require('express'),
  db = require('routes/v1//log/db'),
  main = require('routes/v1/log/graph');

const router = express.Router();

router.use(db);
router.use(main);

module.exports = router;
