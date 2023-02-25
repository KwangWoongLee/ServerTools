'use strict';

const express = require('express'),
  version = require('routes/v1/manager/version'),
  ignore_user = require('routes/v1//manager/ignore_user'),
  kick = require('routes/v1//manager/kick'),
  server_status = require('routes/v1//manager/server_status'),
  schedule = require('routes/v1//manager/schedule');

const router = express.Router();

router.use(version);
router.use(ignore_user);
router.use(kick);
router.use(server_status);
router.use(schedule);

module.exports = router;
