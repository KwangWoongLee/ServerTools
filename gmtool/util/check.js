const express = require('express');
const page = express.Router();
const com = require('util/com');
const ginfo = require('util/ginfo');

module.exports = page;

page.post('/*', function (req, res, next) {
  com.log('post ' + req.url);

  /*
  if (req.headers.host === 'localhost:' + config.port) {
    // local 접속일때 권한 무시
    // 외부 ajax 요청에 응답하기 위산 CORS 세팅
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
    return;
  }
  */
  const err = auth_check(req, res);
  if (err) {
    let cmd = '';
    if (err == ginfo.string.check_01) cmd = 'logout';
    if (err == ginfo.string.check_04) cmd = 'gohome';
    res.send({ err_msg: err, cmd });
    return;
  }

  next();
});

function auth_check(req, res) {
  const path_name = req._parsedUrl.pathname.replace(/\//gi, '_');
  const { logined, grade, email, name } = req.session;

  const target = auth[path_name];
  if (!target) return null; // login , logout , notfound api

  if (!logined) return ginfo.string.check_01;

  const chk = _.find(target.grade, (g) => g == grade);
  if (!chk) return ginfo.string.check_02;

  if (target.user_sel) {
    if (!req.session.sel_uidx) return ginfo.string.check_04;

    const user = {
      uidx: req.session.sel_uidx,
      name: req.session.sel_name,
      id: req.session.sel_id,
      nickname: req.session.sel_nickname,
    };
    req.body.user = user;
  }

  req.body.account = {
    grade,
    email,
    name,
  };

  return null;
}

/***************************************************************************
 * 아래 auth 에 각 post api 의 권한 설정
 * -- grade --
 * - none : 1, // 아무런 권한없이 계정만 생성해둔 경우
 * - logview : 2, // 로그만 볼수 있는 권한 - 통계데이타 , 로그DB
 * - normal : 3, // 기본 권한 검색한 유저 1인의 데이타수정및 로그DB 열람
 * - admin : 4, // 통계데이타 열람을 제외한 모든 권한 , 전체 우편 보내기등
 * - sadmin : 5, // 모든 권한
 * -- user_sel --
 * - true, : 선택한 유저가 있을시에만 응답하는 API
 ****************************************************************************/

const auth = {};
auth._user_search = { grade: [3, 4, 5] };
auth._user_select = { grade: [3, 4, 5] };
auth._user_list = { grade: [3, 4, 5] };
auth._user_info = { grade: [3, 4, 5], user_sel: true };
auth._user_info_update = { grade: [3, 4, 5], user_sel: true };
auth._user_info_delete = { grade: [4, 5], user_sel: true };
auth._user_info_rebirth = { grade: [4, 5], user_sel: true };
auth._user_info_kick = { grade: [3, 4, 5], user_sel: true };
auth._user_money = { grade: [3, 4, 5], user_sel: true };
auth._user_money_update = { grade: [3, 4, 5], user_sel: true };
auth._user_item = { grade: [3, 4, 5], user_sel: true };
auth._user_item_modify = { grade: [3, 4, 5], user_sel: true };
auth._user_item_insert = { grade: [3, 4, 5], user_sel: true };
auth._user_item_delete = { grade: [3, 4, 5], user_sel: true };

auth._user_item_unique = { grade: [3, 4, 5], user_sel: true };
auth._user_item_unique_modify = { grade: [3, 4, 5], user_sel: true };
auth._user_item_unique_insert = { grade: [3, 4, 5], user_sel: true };
auth._user_item_unique_delete = { grade: [3, 4, 5], user_sel: true };

auth._user_collection = { grade: [3, 4, 5], user_sel: true };
auth._user_collection_modify = { grade: [3, 4, 5], user_sel: true };
auth._user_collection_delete = { grade: [3, 4, 5], user_sel: true };

auth._user_achievement = { grade: [3, 4, 5], user_sel: true };
auth._user_achievement_modify = { grade: [3, 4, 5], user_sel: true };
auth._user_achievement_delete = { grade: [3, 4, 5], user_sel: true };

auth._user_avatar = { grade: [3, 4, 5], user_sel: true };
auth._user_avatar_delete = { grade: [3, 4, 5], user_sel: true };
auth._user_avatar_select = { grade: [3, 4, 5], user_sel: true };
auth._user_avatar_insert = { grade: [3, 4, 5], user_sel: true };

auth._user_mail = { grade: [3, 4, 5], user_sel: true };
auth._user_mail_delete = { grade: [3, 4, 5], user_sel: true };
auth._user_mail_insert = { grade: [3, 4, 5], user_sel: true };

auth._user_world = { grade: [3, 4, 5], user_sel: true };
auth._user_world_delete = { grade: [3, 4, 5], user_sel: true };
auth._user_world_modify = { grade: [3, 4, 5], user_sel: true };
auth._user_world_download = { grade: [3, 4, 5], user_sel: true };
auth._user_world_restore = { grade: [3, 4, 5], user_sel: true };

auth._log_db = { grade: [2, 3, 4, 5] };
auth._log_db_column = { grade: [2, 3, 4, 5] };
auth._log_db_data = { grade: [2, 3, 4, 5] };
auth._log_graph = { grade: [2, 5] };
auth._patch_cdn = { grade: [4, 5] };
auth._patch_cdn_upload = { grade: [4, 5] };
auth._patch_cdn_folder = { grade: [4, 5] };
auth._patch_cdn_purge = { grade: [4, 5] };
auth._patch_cdn_delete = { grade: [4, 5] };
auth._patch_cdn_prefetch = { grade: [4, 5] };
auth._patch_cdn_refresh_log = { grade: [4, 5] };
auth._patch_refdata = { grade: [4, 5] };
auth._patch_refdata_column = { grade: [4, 5] };
auth._patch_refdata_data = { grade: [4, 5] };
auth._patch_refdata_upload = { grade: [4, 5] };
auth._patch_refdata_files = { grade: [4, 5] };
auth._patch_refdata_delfile = { grade: [4, 5] };
auth._patch_refdata_sqlmerge = { grade: [4, 5] };

auth._manager_mail = { grade: [4, 5] };

auth._manager_coin_exchange = { grade: [4, 5] };
auth._manager_coin_exchange_add = { grade: [4, 5] };
auth._manager_coin_exchange_modify = { grade: [4, 5] };
auth._manager_coin_exchange_delete = { grade: [4, 5] };

auth._manager_bot = { grade: [4, 5] };
auth._manager_bot_add = { grade: [4, 5] };
auth._manager_bot_modify = { grade: [4, 5] };
auth._manager_bot_delete = { grade: [4, 5] };

auth._manager_base_item = { grade: [4, 5] };
auth._manager_base_item_add = { grade: [4, 5] };
auth._manager_base_item_delete = { grade: [4, 5] };
auth._manager_base_item_modify = { grade: [4, 5] };

auth._manager_nft_owner = { grade: [2, 3, 4, 5] };

auth._manager_kick = { grade: [4, 5] };

auth._manager_schedule = { grade: [4, 5] };
auth._manager_schedule_data = { grade: [4, 5] };
auth._manager_schedule_insert = { grade: [4, 5] };
auth._manager_schedule_update = { grade: [4, 5] };
auth._manager_schedule_delete = { grade: [4, 5] };

auth._manager_version = { grade: [4, 5] };
auth._manager_version_update = { grade: [4, 5] };

auth._manager_ignore_user = { grade: [4, 5] };
auth._manager_ignore_user_insert = { grade: [4, 5] };
auth._manager_ignore_user_delete = { grade: [4, 5] };

auth._manager_account = { grade: [5] };
auth._manager_account_insert = { grade: [5] };
auth._manager_account_delete = { grade: [5] };
auth._manager_account_modify = { grade: [5] };

auth._manager_account_modify = { grade: [5] };

auth._manager_serstate = { grade: [2, 3, 4, 5] };
auth._manager_serstate_packet = { grade: [2, 3, 4, 5] };

auth._manager_chat = { grade: [4, 5] };

auth._manager_message_insert = { grade: [4, 5] };
