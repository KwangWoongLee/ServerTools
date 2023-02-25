import _ from 'lodash';

const data = [];

const insert_title_data = (title) => {
  const id = data.length + 1;
  data.push({ id, title, items: [] });
  return id;
};

const insert_data = (title_id, name, comment, date_type, start_prev_day) => {
  const parent = _.find(data, { id: title_id });
  const id = title_id * 100 + parent.items.length + 1;
  parent.items.push({ id, name, comment, date_type, start_prev_day });
};

const acc_id = insert_title_data('계정 관련 로그');
const login_id = insert_title_data('로그인 관련 로그');
const cache_id = insert_title_data('캐시 아이템로그');
const shop_id = insert_title_data('상점 아이템로그');
const etc_id = insert_title_data('기타 로그');

insert_data(acc_id, 'reg_id_daily', '일별 계정 생성-그래프', 'all', 30);
insert_data(acc_id, 'reg_id_weekly', '주별 계정 생성-그래프', 'all', 100);
insert_data(acc_id, 'reg_id_monthly', '월별 계정 생성-그래프', 'all', 365);
insert_data(acc_id, 'user_retention', '유저 리텐션-그래프', 'start', 16);
insert_data(acc_id, 'reg_id_daily_table', '일별 계정 생성-테이블', 'all', 30);
insert_data(acc_id, 'reg_id_weekly_table', '주별 계정 생성-테이블', 'all', 100);
insert_data(acc_id, 'reg_id_monthly_table', '월별 계정 생성-테이블', 'all', 365);
insert_data(acc_id, 'user_retention_table', '유저 리텐션-테이블', 'start', 16);

insert_data(login_id, 'login_id_daily', '일별 로그인-그래프', 'all', 30);
insert_data(login_id, 'login_id_weekly', '주별 로그인-그래프', 'all', 100);
insert_data(login_id, 'login_id_monthly', '월별 로그인-그래프', 'all', 365);
insert_data(login_id, 'login_id_daily_table', '일별 로그인-테이블', 'all', 30);
insert_data(login_id, 'login_id_weekly_table', '주별 로그인-테이블', 'all', 100);
insert_data(login_id, 'login_id_monthly_table', '월별 로그인-테이블', 'all', 365);

insert_data(cache_id, 'cash_item_cumulative_sales', '아이템별 누적 판매 량-그래프', 'all', 365);
insert_data(cache_id, 'cash_item_cumulative_sales2', '아이템별 누적 판매 액-그래프', 'all', 365);
insert_data(cache_id, 'cash_item_all_sales_money', '총 판매 액-그래프', 'all', 365);
insert_data(cache_id, 'cash_item_daily_sales_money', '일별 판매 액-그래프', 'all', 30);
insert_data(cache_id, 'cash_item_weekly_sales_money', '주별 판매 액-그래프', 'all', 100);
insert_data(cache_id, 'cash_item_monthly_sales_money', '월별 판매 액-그래프', 'all', 365);
insert_data(cache_id, 'cash_item_cumulative_sales_table', '아이템별 누적 판매 량-테이블', 'all', 365);
insert_data(cache_id, 'cash_item_cumulative_sales2_table', '아이템별 누적 판매 액-테이블', 'all', 365);
insert_data(cache_id, 'cash_item_all_sales_money_table', '총 판매 액-테이블', 'all', 365);
insert_data(cache_id, 'cash_item_daily_sales_money_table', '일별 판매 액-테이블', 'all', 30);
insert_data(cache_id, 'cash_item_weekly_sales_money_table', '주별 판매 액-테이블', 'all', 100);
insert_data(cache_id, 'cash_item_monthly_sales_money_table', '월별 판매 액-테이블', 'all', 365);

insert_data(shop_id, 'shop_item_cumulative_sales', '아이템별 판매량-그래프', 'all', 365);
insert_data(shop_id, 'shop_item_cumulative_sales_table', '아이템별 판매량-테이블', 'all', 365);

insert_data(etc_id, 'gold_distribution', '골드 분포도', 'nothing');
insert_data(etc_id, 'cubic_distribution', '큐빅 분포도', 'nothing');
insert_data(etc_id, 'cash_item_buy_user_top100', '유료구매 TOP 100 유저', 'nothing');
insert_data(etc_id, 'new_reg_device', '최초가입 DEVICE', 'all', 30);

export default data;
