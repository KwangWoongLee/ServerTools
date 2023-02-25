const express = require('express');
const page = express.Router();
const com = require('util/com');
const ginfo = require('util/ginfo');
const mysql = require('db/mysql');
const conf = require('util/conf');

module.exports = page;

page.post(
  '/db',
  com.async_router(async (val, req) => {
    const { account } = req.body;
    const logdb = await mysql.logdb_connect(val);

    const result = await table_data_select(logdb);
    return result;
  })
);

page.post(
  '/db/column',
  com.async_router(async (val, req) => {
    const { account, table_name } = req.body;
    const logdb = await mysql.logdb_connect(val);

    const result = await column_data_select(logdb, table_name);
    return result;
  })
);

page.post(
  '/db/data',
  com.async_router(async (val, req) => {
    const { account, query, page, start_dt, end_dt, aidx } = req.body;
    const logdb = await mysql.logdb_connect(val);

    const result = await log_data_select(logdb, query, page, start_dt, end_dt, aidx);
    const next_page = result.length > ginfo.log_list_max ? true : false;
    if (next_page) result.pop();

    return {
      list: _.map(result, (r) => Object.values(r)),
      next_page,
    };
  })
);

//---------------- function ------------------

function table_data_select(logdb) {
  return new Promise(function (resolve, reject) {
    const query = "SELECT TABLE_NAME, TABLE_COMMENT FROM INFORMATION_SCHEMA.TABLES where table_schema = SCHEMA() and TABLE_NAME like 'log_%' ORDER BY TABLE_NAME; ";

    mysql
      .query(logdb, query, [])
      .then((tables) => {
        if (tables.length == 0) return reject(ginfo.string.manager_log_01);
        resolve(tables);
      })
      .catch((e) => reject(e));
  });
}

function column_data_select(logdb, table_name) {
  return new Promise(function (resolve, reject) {
    const query = `SELECT COLUMN_NAME, COLUMN_COMMENT, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = SCHEMA() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION;`;

    mysql
      .query(logdb, query, [table_name])
      .then((results) => {
        const columns = results.map((c) => ({ name: c.COLUMN_NAME, comment: c.COLUMN_COMMENT.replace(/\n/gi, ''), type: c.DATA_TYPE }));
        const tmps = results.map((c) => {
          if (c.DATA_TYPE == 'datetime') return `DATE_FORMAT(${c.COLUMN_NAME}, '%Y-%m-%d %T' ) as ${c.COLUMN_NAME}`;
          else return c.COLUMN_NAME;
        });
        const query = `select ${_.join(tmps, ',')} from ${table_name}`;

        resolve({ columns, query });
      })
      .catch((e) => reject(e));
  });
}

function log_data_select(logdb, column_query, page, start_dt, end_dt, aidx) {
  const start_date = start_dt + ' 00:00:00';
  const end_date = end_dt + ' 23:59:59';

  if (aidx == 0) {
    const query = `${column_query} WHERE reg_dt between  ? and  ? limit ?, ?;`;
    return mysql.query(logdb, query, [start_date, end_date, (page - 1) * ginfo.log_list_max, ginfo.log_list_max + 1]);
  } else {
    const query = `${column_query} WHERE aidx = ? and reg_dt between  ? and  ? limit ?, ?;`;
    return mysql.query(logdb, query, [aidx, start_date, end_date, (page - 1) * ginfo.log_list_max, ginfo.log_list_max + 1]);
  }
}
