const express = require('express');
const page = express.Router();
const cheerio = require('cheerio');
const com = require('util/com');
const redis = require('db/redis');
const conf = require('util/conf');
const ginfo = require('util/ginfo');

module.exports = page;

const get_json = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return {};
  }
};

page.post(
  '/serstate/packet',
  com.async_router(async (val, req) => {
    const { account, user } = req.body;

    let key_list = [];
    if (conf.mode == 'DEV') {
      const redis_key = await com.make_redis_Key('packet:status:game');
      key_list.push(redis_key);
    } else {
      const pattern = com.make_cache_Key('packet', 'status', 'game', '*');
      key_list = await com.get_redis_keys(pattern, 'main');
    }

    if (!key_list.length) throw ginfo.string.not_fount_packet_status_data;

    const replys = await redis.main.command('mget', key_list);

    const results = _.reduce(
      replys,
      (ret, s) => {
        const d = get_json(s);
        _.forEach(d, (val) => {
          if (ret[val.cmd]) {
            ret[val.cmd].call += val.call;
            ret[val.cmd].total += val.total;
            ret[val.cmd].max = Math.max(ret[val.cmd].max, val.max);
            ret[val.cmd].min = Math.min(ret[val.cmd].min, val.min);
            ret[val.cmd].average = ret[val.cmd].total / ret[val.cmd].call;
          } else {
            ret[val.cmd] = val;
          }
        });

        return ret;
      },
      {}
    );

    return _.values(results);
  })
);

page.post(
  '/serstate',
  com.async_router(async (val, req) => {
    const url = `http://${conf.match_info.host}:${conf.match_info.port}`;
    const html = await com.getHtml(url);
    const $ = cheerio.load(html);
    const $bodyList = $('pre');
    let list = [];
    $bodyList.each(function (i, elem) {
      list[i] = JSON.parse($(this).html());
    });

    if (list.length != 3) list = [[], [], []];

    const results = {};
    results.iocp = _.values(list[0]);
    results.live = list[1];
    results.play = list[2];

    return results;
  })
);
