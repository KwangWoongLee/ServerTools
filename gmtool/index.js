const { addPath } = require('app-module-path');
addPath(__dirname);

const http = require('http');
const https = require('https');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const app = express();
const favicon = require('serve-favicon');
const session = require('express-session');
const com = require('util/com');
const redis = require('db/redis');
const mysql = require('db/mysql');
const ref = require('reference');
const conf = require('util/conf');
const io = require('util/socket');
const dateFormat = require('dateformat');
const ginfo = require('util/ginfo');
global._ = require('lodash');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const routes = require('routes');

//const session_store = require('connect-redis')(session)
//const session_store = require('session-file-store')(session);

const schedule = require('node-schedule');
const fnLog = require('util/fnLog');

process.on('uncaughtException', (err) => {
  if (err.stack) {
    err = err.stack;
  }
  console.log(err);
});

const router_error = (err, req, res, next) => {
  if (err.stack) {
    err = err.stack;
  }
  console.log(err);
};

const not_found_api = (req, res) => {
  if (req.method == 'GET') res.redirect('/');
  else res.send({ err_msg: ginfo.string.check_03 });
};

app.use(compression({ threshold: 20480 })); // 20k 이상은 압축

//app.engine('html', ejs.renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.set('views', __dirname + '/views');
// app.set('view engine', 'html');

app.use(cookieParser());

app.use(
  session({
    //store: new session_store(),
    //store: new session_store({ client: redis_client, ttl: 60 * 60 }),
    secret: 'portpolio123!@#',
    //cookie: { maxAge: 1000 * 60 * 60 },
    cookie: { maxAge: null },
    resave: false,
    saveUninitialized: false,
  })
);

app.use('/', express.static(__dirname + '/www'));
app.use('/test', express.static(__dirname + '/test'));
app.use('/*', favicon(path.join(__dirname, 'www', 'favicon.ico')));

// routes
const check_module = require('util/check');

(async function () {
  const val = {};

  try {
    await redis.main.init(conf.redis.main);
    await mysql.init(conf.mysql, process.pid, conf.log.level.console);
    await com.dbtime_sync();
    await ref.load();

    // await op_msg_run();

    // router load
    app.use(check_module);

    app.use(routes);

    app.use(not_found_api);
    app.use(router_error);

    // server port bind
    const server = http.createServer(app);
    await io.init(server);

    server.listen(conf.port, function () {
      console.log(`server running at http://localhost:${conf.port}/`);
    });
  } catch (e) {
    val.err = e;
    const errmsg = '>>>>>>>>>>>>>>> fail to start freemeta gmtool : ' + val.err;
    console.log(errmsg);
  }
})();
