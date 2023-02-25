const express = require('express');
const page = express.Router();
const com = require('util/com');
const mysql = require('db/mysql');
const redis = require('db/redis');
const conf = require('util/conf');

module.exports = page;

page.post(
  '/ignore_user',
  com.async_router(async (val, req) => {
    const { account, user } = req.body;

    const results = [];
    const redis_key = com.make_redis_Key('fmeta', 'ignore_inspect');
    const reply = await redis.main.command('hgetall', [redis_key]);
    if (reply) {
      _.forEach(reply, (obj, key) => {
        results.push({ ip: key, desc: obj });
      });
    }

    return results;
  })
);

page.post(
  '/ignore_user/delete',
  com.async_router(async (val, req) => {
    const { account, user, ip } = req.body;

    const redis_key = com.make_redis_Key('fmeta', 'ignore_inspect');

    await redis.main.command('hdel', [redis_key, ip]);
    return null;
  })
);

page.post(
  '/ignore_user/insert',
  com.async_router(async (val, req) => {
    const { account, user, ip, desc } = req.body;

    const redis_key = com.make_redis_Key('fmeta', 'ignore_inspect');

    await redis.main.command('hset', [redis_key, ip, desc]);
    return null;
  })
);
