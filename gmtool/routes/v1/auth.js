/***********************************************
 * EJS 기본 문법
 * 주석 : <%# ... %>
 * JS 코드 : <% ... %>
 * 변수 출력(html escape 처리: >를 $gt로 변환) : <%= ... %>
 * 태그내부 공백 제거 : <%_ ... _%>
 * html escape안하고 변수 출력 : <%- ... %>
 *
 * Bootstrap v3.1.1 :  (http://getbootstrap.com)
 * bootstrap datetimepicker : http://www.malot.fr/bootstrap-datetimepicker
 * google chart : https://developers.google.com/chart/interactive/docs/gallery
 * jquery-confirm : https://craftpip.github.io/jquery-confirm/
 * chart.js : https://www.chartjs.org/docs/latest
 ************************************************/

const express = require('express');
const page = express.Router();
const com = require('util/com');
const mysql = require('db/mysql');
const ginfo = require('util/ginfo');
const ref = require('reference');
const conf = require('util/conf');

module.exports = page;

page.post(
  '/login',
  com.async_router(async (val, req) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const comdb = await mysql.comdb_connect(val, req.session.email);

    const query = 'select * from _server_manager_account where id = ?;';
    const [result] = await mysql.query(comdb, query, [email]);

    if (!result) throw ginfo.string.user_info_01;
    if (result.password != password) throw ginfo.string.index_02;

    req.session.logined = true;
    req.session.email = result.email;
    req.session.grade = result.grade;
    req.session.name = result.name;
    await com.save_session(req);

    return {
      ref_item: ref.item.get_data(),
      email: result.email,
      grade: result.grade,
      name: result.name,
      mode: conf.mode,
    };
  })
);

page.post(
  '/logout',
  com.async_router(async (val, req) => {
    req.session.destroy();

    return null;
  })
);
