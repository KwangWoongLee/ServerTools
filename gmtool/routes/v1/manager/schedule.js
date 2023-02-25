const express = require('express');
const page = express.Router();
const com = require('util/com');
const ginfo = require('util/ginfo');
const mysql = require('db/mysql');
const conf = require('util/conf');

module.exports = page;

page.post(
  '/schedule',
  com.async_router(async (val, req) => {
    const { account } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);

    const result = await table_data_select(comdb);
    return result;
  })
);

page.post(
  '/schedule/data',
  com.async_router(async (val, req) => {
    const { account, table_name } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);

    const { columns, query } = await column_data_select(comdb, table_name);
    const data = await schedule_data_select(comdb, query);
    return { columns, data: _.map(data, (r) => Object.values(r)) };
  })
);

page.post(
  '/schedule/delete',
  com.async_router(async (val, req) => {
    const { account, table_name, idx } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);

    await delete_schedule_data(comdb, table_name, idx);
    return null;
  })
);

page.post(
  '/schedule/insert',
  com.async_router(async (val, req) => {
    const { account, table_name, column_data } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);

    await insert_schedule_data(comdb, table_name, column_data);
    return null;
  })
);

page.post(
  '/schedule/update',
  com.async_router(async (val, req) => {
    const { account, table_name, column_data, idx } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);

    await update_schedule_data(comdb, idx, table_name, column_data);
    return null;
  })
);

//---------------- function ------------------

function table_data_select(comdb) {
  return new Promise(function (resolve, reject) {
    const query = "SELECT TABLE_NAME, TABLE_COMMENT FROM INFORMATION_SCHEMA.TABLES where table_schema = SCHEMA() and TABLE_NAME like '_schedule_%' ORDER BY TABLE_NAME; ";

    mysql
      .query(comdb, query, [])
      .then((tables) => {
        if (tables.length == 0) return reject(ginfo.string.manager_log_01);
        resolve(tables);
      })
      .catch((e) => reject(e));
  });
}

function column_data_select(comdb, table_name) {
  return new Promise(function (resolve, reject) {
    const query = `SELECT COLUMN_NAME, COLUMN_COMMENT, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = SCHEMA() AND TABLE_NAME = ? ORDER BY ORDINAL_POSITION;`;

    mysql
      .query(comdb, query, [table_name])
      .then((results) => {
        const columns = results.map((c) => ({ name: c.COLUMN_NAME, comment: c.COLUMN_COMMENT.replace(/\n/gi, ''), type: c.DATA_TYPE }));
        const tmps = results.map((c) => {
          if (c.DATA_TYPE == 'datetime') return `DATE_FORMAT(${c.COLUMN_NAME}, '%Y-%m-%d %T' ) as ${c.COLUMN_NAME}`;
          else return c.COLUMN_NAME;
        });
        const query = `select ${_.join(tmps, ',')} from ${table_name} order by end_dt desc`;

        resolve({ columns, query });
      })
      .catch((e) => reject(e));
  });
}

function schedule_data_select(comdb, column_query) {
  const query = `${column_query};`;
  return mysql.query(comdb, query, []);
}

function delete_schedule_data(comdb, table_name, idx) {
  const query = `delete from ${table_name} where idx = ?;`;
  return mysql.query(comdb, query, [idx]);
}

function insert_schedule_data(comdb, table_name, column_data) {
  const query = `insert into ${table_name} (idx, ??) values (null, ?);`;

  return mysql.query(comdb, query, [_.map(column_data, 'name'), _.map(column_data, 'value')]);
}

function update_schedule_data(comdb, idx, table_name, column_data) {
  const object = _.reduce(
    column_data,
    (ret, c) => {
      ret[c.name] = c.value;
      return ret;
    },
    {}
  );
  const query = `update ${table_name} set ? where idx = ?;`;

  return mysql.query(comdb, query, [object, idx]);
}
