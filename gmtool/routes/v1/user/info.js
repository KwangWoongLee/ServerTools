const express = require('express');
const page = express.Router();
const com = require('util/com');
const ginfo = require('util/ginfo');
const mysql = require('db/mysql');
const redis = require('db/redis');
const ref = require('reference');
const conf = require('util/conf');

module.exports = page;

page.post(
  '/info',
  com.async_router(async (val, req) => {
    const { account, user } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);

    const result = await user_data_select(comdb, user.uidx);
    return result;
  })
);

page.post(
  '/info/update',
  com.async_router(async (val, req) => {
    const { account, user } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);

    const is_id = await exist_id(comdb, req.body, user);
    if (is_id) throw new Error(ginfo.string.user_info_02);

    await com.user_kick(user.uidx);

    await update_data(comdb, req.body, user);

    req.session.sel_id = req.body.id;
    req.session.sel_name = req.body.user_name;

    await com.save_session(req);

    return await user_data_select(comdb, user.uidx);
  })
);

page.post(
  '/info/kick',
  com.async_router(async (val, req) => {
    const { user } = req.body;

    await com.user_kick(user.uidx);

    return null;
  })
);

page.post(
  '/info/delete',
  com.async_router(async (val, req) => {
    const { account, user } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);

    const err = await com.user_delete(user.uidx);
    if (err) throw err;

    return await user_data_select(comdb, user.uidx);
  })
);

page.post(
  '/info/rebirth',
  com.async_router(async (val, req) => {
    const { account, user } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);

    const err = await com.user_rebirth(user.uidx);
    if (err) throw err;

    return await user_data_select(comdb, user.uidx);
  })
);

//---------------- function ------------------

function user_data_select(comdb, aidx) {
  return new Promise(function (resolve, reject) {
    const query = 'select idx, id, name, nickname, region from dat_account where idx = ?;';

    mysql
      .query(comdb, query, [aidx])
      .then(([user]) => {
        if (!user) return reject('not found user');
        if (user.block_due < 0) user.block_due = 0;
        resolve(user);
      })
      .catch((e) => reject(e));
  });
}

function exist_id(comdb, body, user) {
  return new Promise(function (resolve, reject) {
    if (user.id != body.id) {
      const query = 'select id from dat_account where id = ? and idx <> ?;';

      mysql
        .query(comdb, query, [body.id, user.aidx])
        .then((results) => (results.length ? resolve(true) : resolve(false)))
        .catch((e) => reject(e));
    }

    resolve(false);
  });
}

function update_data(comdb, body, user) {
  return new Promise(function (resolve, reject) {
    const query = 'update dat_account set id = ?, name = ?,' + `block_dt = date_add(now(), INTERVAL ${body.block_due} minute)` + 'where idx = ?;';

    mysql
      .query(comdb, query, [body.id, body.name, body.sel_avt_idx, body.avt_reg_cnt, body.world_reg_cnt, body.preset_reg_cnt, user.aidx])
      .then((results) => resolve(results))
      .catch((e) => reject(e));
  });
}
