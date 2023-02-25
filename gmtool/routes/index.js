const express = require('express');
const page = express.Router();

const auth = require('routes/v1/auth');
const room = require('routes/v1/room');
const user = require('routes/v1/user');
const manager = require('routes/v1/manager');
const log = require('routes/v1/log');

page.use(auth);
page.use('/room', room);
page.use('/user', user);
page.use('/manager', manager);
page.use('/log', log);

module.exports = page;
