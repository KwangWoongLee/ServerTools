const express = require('express');
const page = express.Router();
const conf = require('util/conf');
const com = require('util/com');
const mysql = require('db/mysql');
const redis = require('db/redis');
const ginfo = require('util/ginfo');
const file = require('util/file');

module.exports = page;

page.post(
  '/server_reset',
  com.async_router(async (val, req) => {
    const password = req.body.password;

    if (!conf.server_reset_password) throw ginfo.string.server_reset_error;

    if (password != conf.server_reset_password) {
      await com.TelegramMessage(`freemeta gmtool server reset by ${req.session.email} : ${req.session.name} failed !!`);

      throw ginfo.string.server_reset_error;
    } else {
      console.log('server reset start!!');
      await server_init(req.session.email, req.session.name, val);
    }
  })
);

async function server_init(email, name, val) {
  const comdb = await mysql.comdb_connect(val, email);
  let tables = await get_tables(comdb);
  for (const table of tables) {
    await mysql.query(comdb, `truncate table ${table.TABLE_NAME};`);
  }

  const logdb = await mysql.logdb_connect(val);
  tables = await get_tables(logdb);
  for (const table of tables) {
    await mysql.query(logdb, `truncate table ${table.TABLE_NAME};`);
  }

  const msgdb = await mysql.msgdb_connect(val, email);
  tables = await get_tables(msgdb);
  for (const table of tables) {
    await mysql.query(msgdb, `truncate table ${table.TABLE_NAME};`);
  }

  const comdb = await mysql.comdb_connect(val, email);
  tables = await get_tables(comdb);
  for (const table of tables) {
    await mysql.query(comdb, `truncate table ${table.TABLE_NAME};`);
  }

  await redis.main.command('flushdb');
  await redis.sub.command('flushdb');
  await redis.msg.command('flushdb');

  await file.clear(conf.file.so.bucket, ['client_patch/', 'tools/', 'default/']);

  await com.TelegramMessage(`freemeta gmtool server reset by ${email} : ${name} success !!`);

  function get_tables(con) {
    const query = "select TABLE_NAME from information_schema.tables where table_schema = schema() and TABLE_NAME not like 'ref_%' and TABLE_NAME not like '_ser_%';";

    return mysql.query(con, query, []);
  }
}
