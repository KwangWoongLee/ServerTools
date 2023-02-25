const express = require('express');
const page = express.Router();
const com = require('util/com');
const mysql = require('db/mysql');

module.exports = page;

page.post(
  '/money',
  com.async_router(async (val, req) => {
    const { account, user } = req.body;
    const comdb = await mysql.comdb_connect(val, req.session.email);

    return await money_data_select(comdb, user.uidx);
  })
);

page.post(
  '/money/update',
  com.async_router(async (val, req) => {
    const { account, user, item_cnt, free_cubic, paid_cubic, wcoin } = req.body;

    const comdb = await mysql.comdb_connect(val, req.session.email);

    await com.user_kick(user.uidx);

    const query = 'update dat_item set item_cnt = ? where aidx = ?;';
    await mysql.query(comdb, query, [gold, free_cubic, paid_cubic, wcoin, user.uidx]);

    return await money_data_select(comdb, user.uidx);
  })
);

//---------------- function ------------------

function money_data_select(comdb, aidx) {
  return new Promise(function (resolve, reject) {
    const query = 'select item_cnt as lucci from dat_item where aidx =  ? and item_code = 1;';

    mysql
      .query(comdb, query, [aidx])
      .then((results) => {
        if (results.length == 1) {
          resolve(results[0]);
        }
      })
      .catch((e) => reject(e));
  });
}
