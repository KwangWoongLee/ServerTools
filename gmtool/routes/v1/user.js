'use strict';

const express = require('express'),
  base = require('routes/v1//user/base'),
  info = require('routes/v1//user/info'),
  money = require('routes/v1//user/money');

const router = express.Router();

router.use(base);
router.use(info);
router.use(money);

module.exports = router;
