const express = require('express');
const page = express.Router();
const com = require('util/com');
const mysql = require('db/mysql');

module.exports = page;

page.post(
  '/version',
  com.async_router(async (val, req) => {
    const comdb = await mysql.comdb_connect(val);
    return select_db(comdb);
  })
);

page.post(
  '/version/update',
  com.async_router(async (val, req) => {
    const comdb = await mysql.comdb_connect(val);
    await update_data(comdb, req.body.data);
    return select_db(comdb);
  })
);

//---------------- function ------------------
function select_db(comdb) {
  const query = com.make_query(['select os_type, version, notice_page, inspect_page, help_page, inspect, account, login ', 'from _ser_management order by os_type; '], []);
  return mysql.query(comdb, query, []);
}

function update_data(comdb, data) {
  const query = com.make_query(
    ['update _ser_management set ', 'version = ?, ', 'notice_page = ?, ', 'inspect_page = ?, ', 'help_page = ?, ', 'inspect = ?, ', 'account = ?, ', 'login = ? ', 'where os_type = ?; '],
    [data.version, data.notice_page, data.inspect_page, data.help_page, data.inspect, data.account, data.login, data.os_type]
  );

  return mysql.query(comdb, query, []);
}
