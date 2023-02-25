'use strict';
const crypto = require('crypto');

exports.encrypt_data = function (client_secret, data) {
  let ret;
  try {
    const iv = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const buf = data;
    const cipher = crypto.createCipheriv('aes-256-cbc', client_secret, Buffer.from(iv));
    let crypted = cipher.update(buf, 'utf8', 'base64');
    crypted += cipher.final('base64');

    ret = crypted;
  } catch (err) {
    if (err) {
      console.log('crypt error(err=' + err + ')');
    }
  }

  return ret;
};
