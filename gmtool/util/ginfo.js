'use strict';

const info = {};

info.user_list_max = 50;
info.log_list_max = 100;
info.ref_list_max = 100;

// money type
info.money_type = {};
info.money_type.gold = 1;
info.money_type.free_cubic = 2;
info.money_type.paid_cubic = 3;

//db_type
info.db_type = {};
info.db_type.game = 1;
info.db_type.log = 2;

//os_type
info.os_type = {};
info.os_type.aos = 1;
info.os_type.ios = 2;
info.os_type.pc = 3;

//message send type
info.message_send_type = {};
info.message_send_type.all = 1;
info.message_send_type.target_aidx = 2;

//msg sender type
info.msg_sender_type = {};
info.msg_sender_type.admin = 6;
info.msg_sender_type.system = 7;

//msg error type
info.msg_error_type = {};
info.msg_error_type.none = 200;

//game msg type
info.game_msg_type = {};
info.game_msg_type.message = 2002;
info.game_msg_type.chat = 2005;

info.auth_level = {};
info.auth_level.sadmin = 5;
info.auth_level.admin = 4;
info.auth_level.normal = 3;
info.auth_level.logview = 2;
info.auth_level.none = 1;

info.item_type = {
  none: 0,
  coustume: 1000,
  equip: 2000,
  box_n_random: 3000,
  box_n_all: 3001,
  box_a_random: 3002,
  box_a_all: 3003,
  box_select: 3004,
  map_normal: 4000,
  map_fishing: 4001,
  map_planter: 4002,
  map_pen: 4003,
  map_grain: 4004,
  map_vegetable: 4005,
  map_fruittree: 4006,
  map_timber: 4007,
  map_mine: 4008,
  map_gather_etc: 4009,
  map_stock: 4010,
  resource: 9901,
};

info.item_type_name = {
  0: 'none',
  1000: 'coustume',
  2000: 'equip',
  3000: 'box_n_random',
  3001: 'box_n_all',
  3002: 'box_a_random',
  3003: 'box_a_all',
  3004: 'box_select',
  4000: 'map_normal',
  4001: 'map_fishing',
  4002: 'map_planter',
  4003: 'map_pen',
  4004: 'map_grain',
  4005: 'map_vegetable',
  4006: 'map_fruittree',
  4007: 'map_timber',
  4008: 'map_mine',
  4009: 'map_gather_etc',
  4010: 'map_stock',
  9901: 'resource',
};

info.bucket_path_world_data = 'world_data';

info.log_type = {
  chart: 0,
  table: 1,
};
// chart 에 쓰일 칼라값
const char_color_list = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'grey', 'black', 'aqua', 'magenta', 'silver', 'navy'];
info.chart_random_color = function () {
  const rand = Math.floor(Math.random() * char_color_list.length);
  return char_color_list[rand];
};
info.chart_color = function (idx) {
  return char_color_list[idx % char_color_list.length];
};
info.chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
  black: 'rgb(0, 0, 0)',
  white: 'rgb(255, 255, 255)',
  aqua: 'rgb(255, 255, 0)',
  magenta: 'rgb(255, 0, 255)',
  silver: 'rgb(192, 192, 192)',
  navy: 'rgb(0, 0, 128)',
};

info.chartAlphaColors = {
  red: 'rgb(255, 99, 132, 0.5)',
  orange: 'rgb(255, 159, 64, 0.5)',
  yellow: 'rgb(255, 205, 86, 0.5)',
  green: 'rgb(75, 192, 192, 0.5)',
  blue: 'rgb(54, 162, 235, 0.5)',
  purple: 'rgb(153, 102, 255, 0.5)',
  grey: 'rgb(201, 203, 207, 0.5)',
  black: 'rgb(0, 0, 0, 0.5)',
  white: 'rgb(255, 255, 255, 0.5)',
  aqua: 'rgb(255, 255, 0, 0.5)',
  magenta: 'rgb(255, 0, 255, 0.5)',
  silver: 'rgb(192, 192, 192, 0.5)',
  navy: 'rgb(0, 0, 128, 0.5)',
};

// string
info.string = {};
info.string.failed_create_room = '방 생성 실패';
info.string.failed_room_list = '룸 리스트 불러오기 실패';
info.string.empty_region_room_list = '해당 지역에 방이 없음';
info.string.failed_enter_room = '방 접속 실패';
info.string.failed_leave_room = '방 나가기 실패';

info.string.check_01 = '로그인을 먼저 진행해주세요';
info.string.check_02 = '권한이 없어 접근할수 없는 페이지 명령 입니다.';
info.string.check_03 = '존재하지 않는 경로의 명령 입니다.';
info.string.check_04 = '유저 선택을 먼저 진행해 주세요';

info.string.index_01 = '존재하지 않는 이메일 입니다.';
info.string.index_02 = '패스워드가 틀립니다.';
info.string.index_03 = '계정이 로그인 불가 등급입니다.';

info.string.manager_log_01 = '로그 DB 정보 로드에 실패 했습니다.';
info.string.manager_log_02 = '검색 조건에 일치하는 데이타가 없습니다.';

info.string.ref_table_01 = '참조 DB 정보 로드에 실패 했습니다.';
info.string.ref_table_02 = '참조 데이타가 없습니다.';

info.string.user_info_01 = '존재하지 않는 유저입니다.';
info.string.user_info_02 = '이미 존재하는 id 입니다.';

info.string.user_search_01 = '잘못된 접근입니다.';
info.string.user_search_02 = '유저 검색중 에러가 발생했습니다. : ';
info.string.user_search_03 = '존재하지 않는 유저입니다.';

info.string.user_puzzle_01 = '이미 존재하는 슬롯 번호 입니다.';

info.string.user_retention_01 = '기준일에 로그인한 유저정보가 없습니다.';

info.string.server_reset_error = '서버 리셋에 실패했습니다.';

info.string.not_found_world_tmp_file = '임시 월드데이타를 찾을수 없습니다.';

info.string.log_main_reg_id_daily_title = '일별 계정 생성';
info.string.log_main_reg_id_weekly_title = '주별 계정 생성';
info.string.log_main_reg_id_monthly_title = '월별 계정 생성';
info.string.log_main_id_daily_title = '일별 로그인';
info.string.log_main_id_weekly_title = '주별 로그인';
info.string.log_main_id_monthly_title = '월별 로그인';
info.string.log_main_cash_item_cumulative_sales_title = '캐시 아이템별 누적 판매량';
info.string.log_main_cash_item_cumulative_sales_title2 = '캐시 아이템별 누적 판매액';
info.string.log_main_cash_item_all_sales_money_title = '캐시 총 판매액';
info.string.log_cash_item_daily_sales_money_title = '캐시 일별 판매액';
info.string.log_cash_item_weekly_sales_money_title = '캐시 주별 판매액';
info.string.log_cash_item_monthly_sales_money_title = '캐시 월별 판매액';
info.string.log_shop_item_cumulative_sales_title = '모든아이템 판매량';
info.string.log_gold_distribution_title = '유저 골드 분포도';
info.string.log_cubic_distribution_title = '유저 큐빅 분포도(유료 + 무료)';
info.string.log_cash_item_buy_user_top100_title = '캐시 아이템 유료구매 TOP 100';
info.string.log_new_reg_device_title = '신규 생성 유저';
info.string.log_user_retention_title = '유저 리텐션';
info.string.log_freemeta_statistics_title = '슬롯 통계';

info.string.log_main_01 = '선택한 날짜에 데이타가 존재하지 않습니다.';
info.string.log_main_02 = '잘못된 페이지 옵션입니다.';

info.string.upload_file_not_found = '파일을 첨부하지 않았습니다.';

info.string.user_deleted = '이미 삭제된 유저입니다.';
info.string.not_found_message_target = '해당 메시지 정보가 없습니다.';

info.string.not_found_ref_payment_code = '테이블에 없는 payment_code 입니다.';
info.string.not_found_ref_item_code = '테이블에 없는 item_code 입니다.';
info.string.not_found_ref_collection_code = '테이블에 없는 collection_code 입니다.';
info.string.not_found_collection_reward_code = '보상 받을수 없는 수집입니다.';
info.string.not_found_ref_achievement_code = '테이블에 없는 achievement_code 입니다.';

info.string.cannot_delete_is_not_my_world = '마이월드가 아니면 삭제할 수 없습니다.';
info.string.not_fount_packet_status_data = '아직 패킷정보가 수집되지 않았습니다.';

info.string.not_found_item = '아이템 코드가 잘못되었습니다.';
info.string.not_costume_item = '코스튬 아이템이 아닌 데이타를 보냈습니다.';

info.mail_expire_day = 30;

module.exports = info;
