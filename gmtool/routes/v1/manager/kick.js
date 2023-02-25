const express = require('express');
const page = express.Router();
const com = require('util/com');
const redis = require('db/redis');
const conf = require('util/conf');

module.exports = page;

page.post(
  '/kick',
  com.async_router(async (val, req) => {
    const uidx = req.body.uidx;
    if (uidx == 0) {
      const key = com.make_cache_Key('fmeta', 'session', '*');
      const del_list = await com.get_redis_keys(key, 'main');

      console.log('redis request delete key size =  : ' + del_list.length);

      for (let i = 0; i < del_list.length; i++) {
        await redis.main.command('del', [del_list[i]]);
      }
    } else {
      const redis_key = com.make_redis_Key('fmeta', 'session', uidx);

      await redis.main.command('del', [redis_key]);
    }
  })
);
