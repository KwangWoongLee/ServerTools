'use strict';

const express = require('express'),
  info = require('routes/v1/room/base'),
  base = require('routes/v1/room/base');

const router = express.Router();

router.use(info);
router.use(base);

module.exports = router;
