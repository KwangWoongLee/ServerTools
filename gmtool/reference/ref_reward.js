'use strict';

const com = require('util/com');
const mysql = require('db/mysql');
const ginfo = require('util/ginfo');

let data = {};

exports.load = async function (mod) {
  const val = {};
  try {
    await mysql.comdb_connect(val);
    await select_data();
  } catch (e) {
    val.err = e;
  }

  mysql.release(val, val.err);

  console.info('load reward reference table ' + (val.err ? 'fail : ' + val.err : 'success !!'));

  return val.err;

  function select_data() {
    return new Promise(function (resolve, reject) {
      const temp_data = {};

      const query = 'select code, reward_type, item_code, item_cnt, _rate as rate, description, seq from ref_reward order by code;';

      val.comdb.query(query, [], function (err, results) {
        if (!err) {
          for (const info of results) {
            if (temp_data[info.code] == undefined) temp_data[info.code] = { reward_type: info.reward_type, total_rate: 0, list: [] };

            temp_data[info.code].total_rate += info.rate;
            temp_data[info.code].list.push(info);
          }
        }

        if (err) reject(err);
        else {
          data = temp_data;
          resolve();
        }
      });
    });
  }
};

exports.get = function (reward_code) {
  return data[reward_code];
};

exports.get_seq_item = function (reward_code, seq_no) {
  const reward = data[reward_code];
  if (!reward) return undefined;

  return _.find(reward.list, ({ seq }) => seq == seq_no);
};

exports.get_reward = function (reward_code) {
  let ret_list = [];
  const reward_data = data[reward_code];
  if (!reward_data) return ret_list;

  if (reward_data.reward_type == ginfo.reward_type.all) {
    for (let i = 0; i < reward_data.list.length; ++i) {
      const reward = reward_data.list[i];
      push(reward);
    }
  } else {
    let reward = null;

    const rand = _.random(reward_data.total_rate - 1);
    let sum_rate = 0;
    for (let i = 0; i < reward_data.list.length; ++i) {
      const ref_data = reward_data.list[i];
      sum_rate += ref_data.rate;
      if (rand < sum_rate) {
        reward = ref_data;
        break;
      }
    }
    push(reward);
  }

  return ret_list;

  function push({ item_code, item_cnt }) {
    ret_list.push({ item_code, item_cnt });
  }
};
