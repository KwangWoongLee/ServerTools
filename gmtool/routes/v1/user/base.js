'use strict';

const express = require('express');
const com = require('util/com');
const mysql = require('db/mysql');
const ginfo = require('util/ginfo');

const router = express.Router();

router.post(
  '/search',
  com.async_router(async (val, req) => {
    const { name, value, account } = req.body;

    const results = select_user(val, req, name, value);
    return results;
  })
);

router.post(
  '/select',
  com.async_router(async (val, req) => {
    const { aidx } = req.body;

    const results = select_user(val, req, 'idx', aidx);
    return results;
  })
);

router.post(
  '/list',
  com.async_router(async (val, req) => {
    const { page } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);
    const query = 'select idx, id, name, nickname, region from dat_account limit ?, ?';

    const result = await mysql.query(comdb, query, [(page - 1) * ginfo.user_list_max, ginfo.user_list_max + 1]);
    const next_page = result.length > ginfo.user_list_max ? true : false;
    if (next_page) result.pop();

    const ret = {
      list: result,
      next_page,
    };

    return ret;
  })
);

//---------- function --------------

async function select_user(val, req, name, value) {
  const comdb = await mysql.comdb_connect(val, req.session.email);

  const get_query = () => {
    if (name == 'name') return `SELECT idx, name, id, nickname, region FROM dat_account where ${name} like '%${value}%';`;
    else return com.make_query(`SELECT idx, name, id, nickname, region FROM dat_account where ${name} = ?;`, [value]);
  };

  const query = get_query();

  const results = await mysql.query(comdb, query, []);
  if (results.length == 0) throw ginfo.string.user_info_01;

  if (results.length == 1) {
    req.session.sel_uidx = results[0].idx;
    req.session.sel_name = results[0].name;
    req.session.sel_id = results[0].id;
    req.session.sel_nickname = results[0].nickname;
    req.session.sel_region = results[0].region;

    await com.save_session(req);
  }

  return results;
}

module.exports = router;
