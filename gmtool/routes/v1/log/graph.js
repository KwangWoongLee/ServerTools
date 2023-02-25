const express = require('express');
const page = express.Router();
const com = require('util/com');
const fnLog = require('util/fnLog');
const ginfo = require('util/ginfo');
const conf = require('util/conf');

module.exports = page;

const log_func = {
  reg_id_daily: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_main_reg_id_daily_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.reg_id_log(req.body, title, 'date(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  reg_id_weekly: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_main_reg_id_weekly_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.reg_id_log(req.body, title, 'yearweek(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  reg_id_monthly: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_main_reg_id_monthly_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.reg_id_log(req.body, title, 'extract(year_month from reg_dt)');
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  user_retention: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_user_retention_title} : ${req.body.start_dt} 부터 D+15`;
    const result = await fnLog.user_retention_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  id_daily: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_main_id_daily_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.id_log(req.body, title, 'date(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  id_weekly: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_main_id_weekly_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.id_log(req.body, title, 'yearweek(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  id_monthly: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_main_id_monthly_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.id_log(req.body, title, 'extract(year_month from reg_dt)');
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  shop_item_cumulative_sales: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_shop_item_cumulative_sales_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.shop_item_cumulative_sales_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  cash_item_all_sales_money: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_main_cash_item_all_sales_money_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_all_sales_money_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  cash_item_daily_sales_money: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_cash_item_daily_sales_money_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_sales_money_log(req.body, title, 'date(transaction_date)', 'date(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  cash_item_weekly_sales_money: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_cash_item_weekly_sales_money_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_sales_money_log(req.body, title, 'yearweek(transaction_date)', 'yearweek(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  cash_item_monthly_sales_money: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_cash_item_monthly_sales_money_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_sales_money_log(req.body, title, 'extract(year_month from transaction_date)', 'extract(year_month from reg_dt)');
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  cash_item_cumulative_sales: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_main_cash_item_cumulative_sales_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_cumulative_sales_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  cash_item_cumulative_sales2: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_main_cash_item_cumulative_sales_title2} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_cumulative_sales_log2(req.body, title);
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  reg_id_daily_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_main_reg_id_daily_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.reg_id_log(req.body, title, 'date(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  reg_id_weekly_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_main_reg_id_weekly_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.reg_id_log(req.body, title, 'yearweek(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  reg_id_monthly_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_main_reg_id_monthly_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.reg_id_log(req.body, title, 'extract(year_month from reg_dt)');
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  user_retention_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_user_retention_title} : ${req.body.start_dt} 부터 D+15`;
    const result = await fnLog.user_retention_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  id_daily_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_main_id_daily_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.id_log(req.body, title, 'date(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  id_weekly_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_main_id_weekly_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.id_log(req.body, title, 'yearweek(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  id_monthly_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_main_id_monthly_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.id_log(req.body, title, 'extract(year_month from reg_dt)');
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  shop_item_cumulative_sales_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_shop_item_cumulative_sales_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.shop_item_cumulative_sales_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  cash_item_all_sales_money_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_main_cash_item_all_sales_money_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_all_sales_money_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  cash_item_daily_sales_money_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_cash_item_daily_sales_money_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_sales_money_log(req.body, title, 'date(transaction_date)', 'date(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  cash_item_weekly_sales_money_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_cash_item_weekly_sales_money_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_sales_money_log(req.body, title, 'yearweek(transaction_date)', 'yearweek(reg_dt)');
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  cash_item_monthly_sales_money_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_cash_item_monthly_sales_money_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_sales_money_log(req.body, title, 'extract(year_month from transaction_date)', 'extract(year_month from reg_dt)');
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  cash_item_cumulative_sales_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_main_cash_item_cumulative_sales_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_cumulative_sales_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  cash_item_cumulative_sales2_table: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_main_cash_item_cumulative_sales_title2} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.cash_item_cumulative_sales_log2(req.body, title);
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  cash_item_buy_user_top100: async function (req) {
    req.body.log_type = ginfo.log_type.table;
    const title = `${ginfo.string.log_cash_item_buy_user_top100_title} : ${com.get_date_string()} 기준`;
    const result = await fnLog.cash_item_buy_user_top100_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, theader: result.ret.theader, tbody: result.ret.tbody, type: 'table' };
  },
  new_reg_device: async function (req) {
    const title = `${ginfo.string.log_new_reg_device_title} : ${req.body.start_dt} 부터 ${req.body.end_dt} 까지`;
    const result = await fnLog.new_reg_device_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, msg: result.ret.msg, type: 'alert' };
  },
  gold_distribution: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_gold_distribution_title} : ${com.get_date_string()} 기준`;
    const result = await fnLog.gold_distribution_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
  cubic_distribution: async function (req) {
    req.body.log_type = ginfo.log_type.chart;
    const title = `${ginfo.string.log_cubic_distribution_title} : ${com.get_date_string()} 기준`;
    const result = await fnLog.cubic_distribution_log(req.body, title);
    if (result.err) throw result.err;
    return { title: title, data: result.ret, type: 'chart' };
  },
};

page.post(
  '/graph',
  com.async_router(async (val, req) => {
    if (log_func[req.body.log_name] == undefined) throw ginfo.string.log_main_02;
    const result = await log_func[req.body.log_name](req);

    return result;
  })
);
