'use strict';

const express = require('express');
const com = require('util/com');
const mysql = require('db/mysql');
const ginfo = require('util/ginfo');
const fnMatch = require('util/fnMatch');
const router = express.Router();
const redis = require('db/redis');

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
    const { aidx, room_id } = req.body;

    const roomkey = `${com.get_time_ms()}-${_.random(0, 100000)}`;
    const key = com.make_redis_Key('PortPolio', 'RoomKey', roomkey);

    const result = await redis.main.command('set', [key, JSON.stringify({ aidx, room_id })]);
    if (!result) throw ginfo.string.failed_enter_room;

    const ret = {
      roomkey,
    };

    return ret;
  })
);

router.post(
  '/list',
  com.async_router(async (val, req) => {
    const { page, region } = req.body;

    const req_room_list = { region };

    const res_room_list = await fnMatch.room_list(req_room_list);
    if (!res_room_list) throw ginfo.string.failed_room_list;

    const roomInfos = res_room_list.roomInfos;
    if (!roomInfos) throw ginfo.string.empty_region_room_list;

    const result = roomInfos;

    // const result = await mysql.query(comdb, query, [(page - 1) * ginfo.user_list_max, ginfo.user_list_max + 1]);
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
    if (name == 'name') return `SELECT idx, name, id, nickname FROM dat_account where ${name} like '%${value}%';`;
    else return com.make_query(`SELECT idx, name, id, nickname FROM dat_account where ${name} = ?;`, [value]);
  };

  const query = get_query();

  const results = await mysql.query(comdb, query, []);
  if (results.length == 0) throw ginfo.string.user_info_01;

  if (results.length == 1) {
    req.session.sel_uidx = results[0].idx;
    req.session.sel_name = results[0].name;
    req.session.sel_id = results[0].id;
    req.session.sel_nickname = results[0].nickname;

    await com.save_session(req);
  }

  return results;
}

module.exports = router;
