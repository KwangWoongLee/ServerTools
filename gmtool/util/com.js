'use strict';

const redis = require('db/redis');
const sqlstr = require('sqlstring');
const dateformat = require('dateformat');
const conf = require('util/conf');
const request = require('request');
const sprintf = require('sprintf');
const mysql = require('db/mysql');
const ginfo = require('util/ginfo');

exports.make_query = function (strlist, inputlist) {
  const query = typeof strlist === 'string' ? strlist : _.join(strlist, ' ');

  return sqlstr.format(query, inputlist);
};

exports.make_cache_Key = function (...args) {
  return _.join(args, ':');
};

exports.get_redis_keys = async function (pattern, name) {
  let cursor = '0';
  let key_list = [];
  while (1) {
    let reply = await redis[name].command('scan', [cursor, 'match', pattern, 'count', 2000]);
    cursor = reply[0];
    if (reply[1].length == 0) break;

    for (let i = 0; i < reply[1].length; i++) key_list.push(reply[1][i]);

    if (cursor == '0') break;
  }

  return key_list;
};

exports.getType = function (obj) {
  const objectName = Object.prototype.toString.call(obj);
  const match = /\[object (\w+)\]/.exec(objectName);
  return match[1].toLowerCase();
};

exports.getClone = function (obj) {
  if (null == obj || 'object' != typeof obj) return obj;
  if (this.getType(obj) == 'date') {
    let copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  if (this.getType(obj) == 'array') {
    let copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = this.getClone(obj[i]);
    }
    return copy;
  }
  if (this.getType(obj) == 'object') {
    let copy = {};
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = this.getClone(obj[attr]);
    }
    return copy;
  }
  return obj;
};

let dbtime_diff;
exports.dbtime_sync = function () {
  return new Promise((resolve, reject) => {
    const val = {};
    mysql
      .comdb_connect(val)
      .then((comdb) => mysql.query(comdb, 'select unix_timestamp(now()) as dbtime;'))
      .then(([{ dbtime }]) => {
        const now = new Date();
        const time = Math.floor(now.valueOf() / 1000);
        dbtime_diff = time - dbtime;
        resolve();
      })
      .catch((e) => reject(e))
      .finally(() => {
        mysql.release(val);
      });
  });
};

exports.get_time = function () {
  const now = new Date();
  const time = Math.floor(now.valueOf() / 1000);

  return time - dbtime_diff;
};

exports.get_time_ms = function () {
  const now = new Date();
  const time = now.valueOf();

  if (dbtime_diff) return time - dbtime_diff * 1000;
  else return time;
};

exports.get_date = function () {
  const now = new Date(this.get_time() * 1000);
  return now;
};

exports.get_day_unix_time = function (day) {
  return 1000 * 60 * 60 * 24 * day;
};

exports.get_user = function (req) {
  if (req.session.sel_aidx)
    return {
      aidx: req.session.sel_aidx,
      name: req.session.sel_name,
      id: req.session.sel_id,
      nickname: req.session.sel_nickname,
    };
  else
    return {
      aidx: 0,
      name: '',
      id: '',
      nickname: '',
    };
};

exports.admin_check = function (req, res) {
  if (req.session.logined !== true) return -1;

  return req.session.grade;
};

exports.get_object_type = function (obj) {
  const objectName = Object.prototype.toString.call(obj);
  const match = /\[object (\w+)\]/.exec(objectName);
  return match[1].toLowerCase();
};

exports.get_date_string = function (date) {
  if (date == undefined) date = this.get_date();
  return dateformat(date, 'yyyy-mm-dd HH:MM:ss');
};

exports.get_date_string2 = function (date) {
  return dateformat(date, 'yyyy-mm-dd');
};

exports.get_diff_day = function (from, to) {
  const from_date = new Date(from);
  const to_date = new Date(to);

  let milisecond_gap = to_date.valueOf() - from_date.valueOf();
  if (milisecond_gap < 0) milisecond_gap = 0;

  return parseInt(milisecond_gap / (1000 * 60 * 60 * 24));
};

const logview = true;
exports.log = function (str) {
  if (logview) console.log(str);
};

exports.redirect_err_page = function (req, res, msg) {
  req.session.last_error_msg = msg;
  this.save_session(req).then(() => {
    res.redirect('/error');
  });
};

exports.save_session = function (req) {
  return new Promise(function (resolve) {
    req.session.save(function (d) {
      resolve();
    });
  });
};

exports.base64encode = function (plaintext) {
  return Buffer.from(plaintext, 'utf8').toString('base64');
};

exports.base64decode = function (base64text) {
  return Buffer.from(base64text, 'base64').toString('utf8');
};

exports.shuffle = function (list, loop = 1) {
  for (let l = 0; l < loop; l++) {
    for (let i = list.length - 1; i >= 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const itemAtIndex = list[randomIndex];
      list[randomIndex] = list[i];
      list[i] = itemAtIndex;
    }
  }
  return;
};

exports.make_redis_Key = function (...args) {
  return _.join(args, ':');
};

exports.get_private_room_name = function (aidx) {
  return `p_${aidx}`;
};

exports.user_delete = async function (aidx) {
  const val = {};

  try {
    const comdb = await mysql.comdb_connect(val);
    const { name, id } = await get_user_info(comdb, aidx);

    const header = name.substring(0, 3);
    if (header == '(D)') throw 'error deleted user';

    const new_name = '(D)' + name;
    const new_id = `${this.get_time()}_` + id;

    await mysql.comdb_transaction(val);
    await update_name_account(comdb, new_name, aidx);
    await update_id_account(comdb, new_id, aidx);
    await update_name_preview(comdb, new_name, aidx);

    const msgdb = await mysql.msgdb_connect(val);
    await mysql.msgdb_transaction(val);
    await update_name_msg_account(msgdb, new_name, aidx);
  } catch (e) {
    val.err = e;
  }

  mysql.release(val, val.err);

  return val.err;
};

exports.user_rebirth = async function (aidx) {
  const val = {};

  try {
    const comdb = await mysql.comdb_connect(val);
    const { name, id } = await get_user_info(comdb, aidx);

    const header = name.substring(0, 3);
    if (header != '(D)') throw 'error live user';

    const new_name = name.substring(3, name.length);
    const new_id = id.split('_')[1];

    await mysql.comdb_transaction(val);
    await update_name_account(comdb, new_name, aidx);
    await update_id_account(comdb, new_id, aidx);
    await update_name_preview(comdb, new_name, aidx);

    const msgdb = await mysql.msgdb_connect(val);
    await mysql.msgdb_transaction(val);
    await update_name_msg_account(msgdb, new_name, aidx);
  } catch (e) {
    val.err = e;
  }

  mysql.release(val, val.err);

  return val.err;
};

function get_user_info(comdb, aidx) {
  return new Promise((resolve, reject) => {
    const query = 'select name, id from dat_account where idx=?';
    mysql
      .query(comdb, query, [aidx])
      .then((results) => (results.length ? resolve(results[0]) : reject('not found user aidx:' + aidx)))
      .catch((e) => reject(e));
  });
}

function update_name_account(comdb, new_name, aidx) {
  const query = 'update dat_account set name=? where idx=?';
  return mysql.query(comdb, query, [new_name, aidx]);
}

function update_id_account(comdb, new_id, aidx) {
  const query = 'update dat_account set id=? where idx=?';
  return mysql.query(comdb, query, [new_id, aidx]);
}

function update_name_preview(comdb, new_name, aidx) {
  const query = 'update dat_preview set name=? where aidx=?';
  return mysql.query(comdb, query, [new_name, aidx]);
}

function update_name_msg_account(msgdb, new_name, aidx) {
  const query = 'update dat_user_account set name=? where idx=?';
  return mysql.query(msgdb, query, [new_name, aidx]);
}

exports.array_division = function (arr, n) {
  const tmp = [];
  const len = arr.length;
  if (len == 0) return tmp;
  let cnt = Math.floor(len / n) + (Math.floor(len % n) > 0 ? 1 : 0);
  for (let i = 0; i < cnt; i++) {
    tmp.push(arr.splice(0, n));
  }

  return tmp;
};

exports.res_render = function (res, page_name, obj, cur_name = '') {
  const default_obj = {
    cur_name: cur_name,
    mode: conf.mode,
  };

  res.render(page_name, _.merge(default_obj, obj));
};

exports.getHtml = async function (url) {
  return new Promise((resolve, reject) => {
    request.get(url, (err, res, body) => {
      if (err) return reject(err);
      resolve(body);
    });
  });
};

exports.async_router = function (asyncFn) {
  return async (req, res) => {
    if (conf.mode == 'DEV') console.log('\x1b[35m%s\x1b[0m', 'req data = ', req.body);
    const val = {};
    try {
      const ret = await asyncFn(val, req);

      if (conf.mode == 'DEV') console.log('\x1b[35m%s\x1b[0m', 'success res data = ', ret ? ret : {});
      res.send(ret ? ret : {});
    } catch (e) {
      val.err = e;
      const err_msg = e.message ? e.message : e.toString();
      if (conf.mode == 'DEV') console.log('\x1b[31m%s\x1b[0m', 'error res data = ', err_msg);
      res.send({ err_msg });
    }
    mysql.release(val, val.err);
  };
};

exports.user_kick = function (uidx) {
  const redis_key = this.make_redis_Key('fmeta', 'session', uidx);
  return redis.main.command('del', [redis_key]);
};
