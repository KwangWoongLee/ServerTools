'use strict';

global._ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//const cors = require('cors');
const compression = require('compression');
const path = require('path');
const conf = require('./config.json');
const favicon = require('serve-favicon');
const server = require('http').Server(app);
const com = require('./com');
const request = require('request');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(cors());
app.use(compression({ threshold: 20480 })); // 20k 이상은 압축

app.use('/', express.static(path.join(__dirname, 'www', 'game')));

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found Page' });
});

server.listen(conf.port, function () {
  const connect_info = `http://${conf.host}:${conf.port}`;
  console.log(`document server start : ${connect_info}`);
});
