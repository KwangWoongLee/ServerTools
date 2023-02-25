'use strict';

const mysql = require('mysql'),
  mysql_connection = require('mysql/lib/Connection');

let log_level = 'debug';

const originalQuery = mysql_connection.prototype.query;
mysql_connection.prototype.query = function (...args) {
  const [sql, values] = args;

  if (log_level === 'debug') {
    if (typeof sql == 'object') {
      console.debug(`[${this.config.database}]`, sql.sql);
    } else {
      console.debug(`[${this.config.database}]`, sql, 'values :', values);
    }
  }

  return originalQuery.apply(this, args);
};

function report(name, pool) {
  console.info(`[${name}] all : ${pool._allConnections.length}, wait : ${pool._connectionQueue.length}, acqu : ${pool._acquiringConnections.length}, free : ${pool._freeConnections.length}`);
}

let comPool, logPool, userPool;

exports.init = async function (config, index, loglevel) {
  log_level = loglevel;
  comPool = mysql.createPool(config.com);
  console.info(`mysql ${config.com.database} com db init : ${config.com.host}:${config.com.port}`);

  setInterval(() => {
    console.log('==== srv idx  ', index, '======');
    report('game db pool', comPool);

    console.log('==============================');
  }, 1000 * 60 * 5);
};

exports.comdb_connect = function (val) {
  if (val.comdb) return Promise.resolve(val.comdb);

  return new Promise((resolve, reject) => {
    comPool.getConnection(function (err, con) {
      if (err) {
        console.error('comdb_connect error : ', err);
        reject(err);
      } else {
        val.comdb = con;
        val.comdb.trans = false;
        resolve(con);
        console.debug('comdb connect');
      }
    });
  });
};

exports.comdb_transaction = function (val) {
  if (val.comdb.trans) return Promise.resolve();

  return new Promise((resolve, reject) => {
    val.comdb.beginTransaction(function (err) {
      if (err) {
        console.error('comdb_transaction error : ', err);
        reject(err);
      } else {
        val.comdb.trans = true;
        resolve();
        console.debug('comdb transaction start');
      }
    });
  });
};

exports.query = function (con, query, values = []) {
  return new Promise((resolve, reject) => {
    con.query(query, values, function (err, results) {
      if (err) {
        console.error('db_query error : ', err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

exports.release = function (val, err) {
  if (err) {
    if (val.comdb && val.comdb.trans) {
      val.comdb.rollback();
      val.comdb.trans = false;
      console.debug('comdb transaction rollback');
    }
  } else {
    if (val.comdb && val.comdb.trans) {
      val.comdb.commit();
      val.comdb.trans = false;
      console.debug('comdb transaction commit');
    }
  }
  if (val.comdb) {
    console.debug('comdb connect pool release');
    val.comdb.release();
  }
};

exports.single_query = async function (conf, query, values = []) {
  const val = {};
  let results = {};
  try {
    val.connect = await connect(conf);
    results = await this.query(val.connect, query, []);
  } catch (e) {
    val.err = e;
  } finally {
    if (val.connect) val.connect.end();
  }

  if (val.err) throw 'single query error : ' + val.err;
  return results;

  function connect(conf) {
    return new Promise((resolve, reject) => {
      const con = mysql.createConnection(conf);
      con.connect((err) => {
        if (err) reject(err);
        else resolve(con);
      });
    });
  }
};
