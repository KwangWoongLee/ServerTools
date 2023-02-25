const com = require('util/com');
const mysql = require('db/mysql');
const ginfo = require('util/ginfo');
const ref = require('reference');
const dateFormat = require('dateformat');

module.exports.reg_id_log = async function (body, title, group) {
  const val = {};
  const ret = [];

  try {
    const logdb = await mysql.logdb_connect(val);

    if (Number(body.log_type) == ginfo.log_type.chart) {
      const labels = await date_select(logdb);
      if (!labels) throw ginfo.string.log_main_01;

      const arr = com.array_division(labels, 30);
      let start = 1;
      let end = 0;

      for (const d of arr) {
        end += d.length;
        const { chart_data, chart_option } = chart_make(`${title} : ${start}~${end}`);
        start += d.length;

        for (let i = 0; i < d.length; i++) {
          const dataset = await dataset_select(logdb, d[i]);

          chart_data.labels.push(d[i]);
          chart_data.datasets[0].data.push(dataset.uidx_cnt);
          chart_data.datasets[1].data.push(dataset.uuid_cnt);
        }

        ret.push({
          type: 'bar',
          data: chart_data,
          options: chart_option,
        });
      }
    } else if (Number(body.log_type) == ginfo.log_type.table) {
      const labels = await date_select(logdb);
      if (!labels) throw ginfo.string.log_main_01;

      const reg_id_list = [];
      for (let i = 0; i < labels.length; i++) {
        const dataset = await dataset_select(logdb, labels[i]);

        reg_id_list[i] = [];
        reg_id_list[i].push(labels[i]);
        reg_id_list[i].push(dataset.uidx_cnt);
        reg_id_list[i].push(dataset.uuid_cnt);
      }

      ret.theader = ['행번호', '날짜', '계정 수', '디바이스 수'];
      ret.tbody = reg_id_list;
    }
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/

  function chart_make(title) {
    const chart_option = {
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },

      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          beginAtZero: true,
        },
      },
    };
    const chart_data = {};
    chart_data.labels = [];
    chart_data.datasets = [
      {
        type: 'bar',
        label: '계정 수',
        backgroundColor: ginfo.chartAlphaColors.orange,
        borderColor: ginfo.chartColors.orange,
        borderWidth: 2,
        data: [],
      },
      {
        type: 'bar',
        label: '디바이스 수',
        backgroundColor: ginfo.chartAlphaColors.blue,
        borderColor: ginfo.chartColors.blue,
        borderWidth: 2,
        data: [],
      },
    ];

    return { chart_option, chart_data };
  }

  function date_select(logdb) {
    const start_date = body.start_dt + ' 00:00:00';
    const end_date = body.end_dt + ' 23:59:59';

    return new Promise(function (resolve, reject) {
      const query = com.make_query([`select convert(${group} , char) as reg_date `, `from log_regid where reg_dt between ? and ? `, `group by reg_date order by reg_date; `], [start_date, end_date]);

      mysql
        .query(logdb, query, [])
        .then((results) => {
          const date_list = [];
          if (results.length == 0) {
            throw new Error(ginfo.string.log_main_01);
          } else {
            for (let i = 0; i < results.length; i++) date_list.push(results[i].reg_date);
          }
          resolve(date_list);
        })
        .catch((e) => reject(e));
    });
  }

  function dataset_select(logdb, date) {
    return new Promise(function (resolve, reject) {
      const query = com.make_query([`select count(cnt) as uuid_cnt, sum(cnt) as uidx_cnt from ( `, `select count(uuid) as cnt `, `from log_regid where ${group} = ? group by uuid `, `) as A; `], [date]);

      mysql
        .query(logdb, query, [])
        .then((results) => resolve(results[0]))
        .catch((e) => reject(e));
    });
  }
};

module.exports.id_log = async function (body, title, group) {
  const val = {};
  const ret = [];

  try {
    const logdb = await mysql.logdb_connect(val);

    if (Number(body.log_type) == ginfo.log_type.chart) {
      const labels = await date_select(logdb);
      if (!labels) throw ginfo.string.log_main_01;

      const arr = com.array_division(labels, 30);
      let start = 1;
      let end = 0;

      for (const d of arr) {
        end += d.length;
        const { chart_data, chart_option } = chart_make(`${title} : ${start}~${end}`);
        start += d.length;

        for (let i = 0; i < d.length; i++) {
          const dataset = await dataset_select(logdb, d[i]);

          chart_data.labels.push(d[i]);
          chart_data.datasets[0].data.push(0);
          chart_data.datasets[1].data.push(0);
          chart_data.datasets[2].data.push(0);

          for (let j = 0; j < dataset.length; j++) {
            if (dataset[j].os_type == ginfo.os_type.aos) chart_data.datasets[0].data[i] = dataset[j].uidx_cnt;
            else if (dataset[j].os_type == ginfo.os_type.ios) chart_data.datasets[1].data[i] = dataset[j].uidx_cnt;
            else if (dataset[j].os_type == ginfo.os_type.pc) chart_data.datasets[2].data[i] = dataset[j].uidx_cnt;
          }
        }

        ret.push({
          type: 'bar',
          data: chart_data,
          options: chart_option,
        });
      }
    } else if (Number(body.log_type) == ginfo.log_type.table) {
      const labels = await date_select(logdb);
      if (!labels) throw ginfo.string.log_main_01;

      const id_list = [];
      for (let i = 0; i < labels.length; i++) {
        const dataset = await dataset_select(logdb, labels[i]);

        id_list[i] = [];
        id_list[i].push(labels[i]);

        id_list[i].push(0);
        id_list[i].push(0);
        id_list[i].push(0);

        for (let j = 0; j < dataset.length; j++) {
          if (dataset[j].os_type == ginfo.os_type.aos) id_list[i][1] = dataset[j].uidx_cnt;
          else if (dataset[j].os_type == ginfo.os_type.ios) id_list[i][2] = dataset[j].uidx_cnt;
          else if (dataset[j].os_type == ginfo.os_type.pc) id_list[i][3] = dataset[j].uidx_cnt;
        }
      }

      ret.theader = ['행번호', '날짜', 'AOS 계정 수', 'IOS 계정 수', 'PC 계정 수'];
      ret.tbody = id_list;
    }
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/

  function chart_make(title) {
    const chart_option = {
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          beginAtZero: true,
        },
      },
    };
    const chart_data = {};
    chart_data.labels = [];
    chart_data.datasets = [
      {
        type: 'bar',
        label: 'AOS 계정 수',
        backgroundColor: ginfo.chartAlphaColors.orange,
        borderColor: ginfo.chartColors.orange,
        borderWidth: 2,
        data: [],
      },
      {
        type: 'bar',
        label: 'IOS 계정 수',
        backgroundColor: ginfo.chartAlphaColors.blue,
        borderColor: ginfo.chartColors.blue,
        borderWidth: 2,
        data: [],
      },
      {
        type: 'bar',
        label: 'PC 계정 수',
        backgroundColor: ginfo.chartAlphaColors.yellow,
        borderColor: ginfo.chartColors.yellow,
        borderWidth: 2,
        data: [],
      },
    ];

    return { chart_option, chart_data };
  }

  function date_select(logdb) {
    const start_date = body.start_dt + ' 00:00:00';
    const end_date = body.end_dt + ' 23:59:59';

    return new Promise(function (resolve, reject) {
      const query = com.make_query([`select convert(${group} , char) as reg_date `, `from log_login where reg_dt between ? and ? `, `group by reg_date order by reg_date; `], [start_date, end_date]);

      mysql
        .query(logdb, query, [])
        .then((results) => {
          const date_list = [];
          if (results.length == 0) {
            throw new Error(ginfo.string.log_main_01);
          } else {
            for (let i = 0; i < results.length; i++) date_list.push(results[i].reg_date);
          }
          resolve(date_list);
        })
        .catch((e) => reject(e));
    });
  }

  function dataset_select(logdb, date) {
    return new Promise(function (resolve, reject) {
      const query = com.make_query([`select sum(cnt) as uidx_cnt, os_type from ( `, `select count(aidx) as cnt, os_type `, `from log_login where ${group} = ? group by aidx, os_type `, `) as A group by os_type; `], [date]);

      mysql
        .query(logdb, query, [])
        .then((results) => resolve(results))
        .catch((e) => reject(e));
    });
  }
};

module.exports.cash_item_cumulative_sales_log = async function (body, title) {
  const val = {};
  const ret = [];

  try {
    chart_make(val);
    const logdb = await mysql.logdb_connect(val);

    if (Number(body.log_type) == ginfo.log_type.chart) {
      const db_data = await data_select(logdb);
      if (!db_data) throw ginfo.string.log_main_01;

      if (db_data.length > 1)
        db_data.sort((a, b) => {
          return b.sell_cnt - a.sell_cnt;
        });

      const arr = com.array_division(db_data, 30);

      let start = 1;
      let end = 0;
      for (const d of arr) {
        end += d.length;
        const { chart_data, chart_option } = chart_make(`${title} : ${start}~${end}`);
        start += d.length;

        for (let i = 0; i < d.length; i++) {
          const payment_code = d[i].payment_code;
          const cnt = d[i].sell_cnt;
          if (cnt == null) cnt = 0;

          const payment_info = ref.payment.get(payment_code);
          if (!payment_info) throw ginfo.string.not_found_ref_payment_code;

          chart_data.labels.push(payment_info.name);
          chart_data.datasets[0].data.push(cnt);

          const color = ginfo.chart_color(i);
          chart_data.datasets[0].borderColor.push(ginfo.chartColors[color]);
          chart_data.datasets[0].backgroundColor.push(ginfo.chartAlphaColors[color]);
        }

        ret.push({
          type: 'bar',
          data: chart_data,
          options: chart_option,
        });
      }
    } else if (Number(body.log_type) == ginfo.log_type.table) {
      const db_data = await data_select(logdb);
      if (!db_data) throw ginfo.string.log_main_01;

      if (db_data.length > 1)
        db_data.sort((a, b) => {
          return b.sell_cnt - a.sell_cnt;
        });

      const data_list = [];
      for (let i = 0; i < db_data.length; i++) {
        data_list[i] = [];
        const cnt = db_data[i].sell_cnt;
        if (cnt == null) cnt = 0;

        const payment_info = ref.payment.get(db_data[i].payment_code);
        if (!payment_info) throw ginfo.string.not_found_ref_payment_code;

        data_list[i].push(payment_info.name);
        data_list[i].push(cnt);
      }

      ret.theader = ['판매 순위', '결제 상품명', '판매 수'];
      ret.tbody = data_list;
    }
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/
  function chart_make(title) {
    chart_option = {
      indexAxis: 'y',
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
    };

    const chart_data = {};
    chart_data.labels = [];
    chart_data.datasets = [
      {
        label: '판매 갯수',
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2,
        data: [],
      },
    ];

    return { chart_option, chart_data };
  }

  function data_select(logdb) {
    const start_date = body.start_dt + ' 00:00:00';
    const end_date = body.end_dt + ' 23:59:59';

    return new Promise(function (resolve, reject) {
      const query = com.make_query(
        [
          'select payment_code, sum(sell_cnt) as sell_cnt from ( ',
          '    select payment_code, count(payment_code) as sell_cnt ',
          '    from log_payment_aft ',
          '    where transaction_date between ? and ?  ',
          '    group by payment_code   ',
          '    union all   ',
          '    select payment_code, count(payment_code) as sell_cnt ',
          '    from log_payment_aos ',
          '    where reg_dt between ? and ?  ',
          '    group by payment_code   ',
          '    union all   ',
          '    select payment_code, count(payment_code) as sell_cnt ',
          '    from log_payment_ios ',
          '    where reg_dt between ? and ?  ',
          '    group by payment_code  ',
          ') as A group by payment_code order by payment_code; ',
        ],
        [start_date, end_date, start_date, end_date, start_date, end_date]
      );

      mysql
        .query(logdb, query, [])
        .then((results) => (results.length ? resolve(results) : resolve()))
        .catch((e) => reject(e));
    });
  }
};

module.exports.cash_item_cumulative_sales_log2 = async function (body, title) {
  const val = {};
  const ret = [];

  try {
    const logdb = await mysql.logdb_connect(val);

    if (Number(body.log_type) == ginfo.log_type.chart) {
      const db_data = await data_select(logdb);
      if (!db_data) throw ginfo.string.log_main_01;

      if (db_data.length > 1)
        db_data.sort((a, b) => {
          return b.sale_money - a.sale_money;
        });

      const arr = com.array_division(db_data, 30);

      let start = 1;
      let end = 0;
      for (const d of arr) {
        end += d.length;
        const { chart_data, chart_option } = chart_make(`${title} : ${start}~${end}`);
        start += d.length;

        for (let i = 0; i < d.length; i++) {
          const payment_code = d[i].payment_code;
          const sale_money = d[i].sale_money;
          const payment_info = ref.payment.get(payment_code);
          if (!payment_info) throw ginfo.string.not_found_ref_payment_code;

          chart_data.labels.push(payment_info.name);
          chart_data.datasets[0].data.push(sale_money);

          const color = ginfo.chart_color(i);
          chart_data.datasets[0].borderColor.push(ginfo.chartColors[color]);
          chart_data.datasets[0].backgroundColor.push(ginfo.chartAlphaColors[color]);
        }

        ret.push({
          type: 'bar',
          data: chart_data,
          options: chart_option,
        });
      }
    } else if (Number(body.log_type) == ginfo.log_type.table) {
      const db_data = await data_select(logdb);
      if (!db_data) throw ginfo.string.log_main_01;

      if (db_data.length > 1)
        db_data.sort((a, b) => {
          return b.sale_money - a.sale_money;
        });

      const data_list = [];
      for (let i = 0; i < db_data.length; i++) {
        data_list[i] = [];

        const payment_info = ref.payment.get(db_data[i].payment_code);
        if (!payment_info) throw ginfo.string.not_found_ref_payment_code;

        data_list[i].push(payment_info.name);
        data_list[i].push(db_data[i].sale_money);
      }

      ret.theader = ['판매 순위', '결제 상품명', '판매액'];
      ret.tbody = data_list;
    }
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/

  function chart_make(title) {
    const chart_option = {
      indexAxis: 'y',
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          beginAtZero: true,
        },
      },
    };

    const chart_data = {};
    chart_data.labels = [];
    chart_data.datasets = [
      {
        label: '판매 액',
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2,
        data: [],
      },
    ];

    return { chart_option, chart_data };
  }

  function data_select(logdb) {
    const start_date = body.start_dt + ' 00:00:00';
    const end_date = body.end_dt + ' 23:59:59';

    return new Promise(function (resolve, reject) {
      const query = com.make_query(
        [
          'select payment_code, sum(sale_money) as sale_money from ( ',
          '    select payment_code, sum(amount) as sale_money ',
          '    from log_payment_aft ',
          '    where transaction_date between ? and ?  ',
          '    group by payment_code   ',
          '    union all   ',
          '    select payment_code, sum(amount) as sale_money ',
          '    from log_payment_aos ',
          '    where reg_dt between ? and ?  ',
          '    group by payment_code   ',
          '    union all   ',
          '    select payment_code, sum(amount) as sale_money ',
          '    from log_payment_ios ',
          '    where reg_dt between ? and ?  ',
          '    group by payment_code  ',
          ') as A group by payment_code order by sale_money; ',
        ],
        [start_date, end_date, start_date, end_date, start_date, end_date]
      );

      mysql
        .query(logdb, query, [])
        .then((results) => (results.length ? resolve(results) : resolve()))
        .catch((e) => reject(e));
    });
  }
};

module.exports.cash_item_all_sales_money_log = async function (body, title) {
  const val = {};
  const ret = [];

  try {
    chart_make(val);
    const logdb = await mysql.logdb_connect(val);

    if (Number(body.log_type) == ginfo.log_type.chart) {
      const db_data = await data_select(logdb);
      if (!db_data) throw ginfo.string.log_main_01;

      let all = 0;
      for (let i = 0; i < db_data.length; i++) {
        val.chart_data.labels.push(db_data[i].market_type);
        if (db_data[i].sale_money == null) db_data[i].sale_money = 0;
        val.chart_data.datasets[0].data.push(db_data[i].sale_money);
        all += db_data[i].sale_money;

        const color = ginfo.chart_color(i);
        val.chart_data.datasets[0].borderColor.push(ginfo.chartAlphaColors.black);
        val.chart_data.datasets[0].backgroundColor.push(ginfo.chartColors[color]);
      }

      if (all == 0) throw ginfo.string.log_main_01;

      val.chart_data.labels.push('합계');
      val.chart_data.datasets[0].data.push(0);
      val.chart_data.datasets[0].borderColor.push(ginfo.chartAlphaColors.black);
      val.chart_data.datasets[0].backgroundColor.push(ginfo.chartColors.aqua);
      val.chart_data.datasets[1].data = [0, 0, 0, all];

      ret.push({
        type: 'pie',
        data: val.chart_data,
        options: val.chart_option,
      });
    } else if (Number(body.log_type) == ginfo.log_type.table) {
      const db_data = await data_select(logdb);
      if (!db_data) throw ginfo.string.log_main_01;

      if (db_data.length > 1)
        db_data.sort((a, b) => {
          return b.sale_money - a.sale_money;
        });

      const data_list = [];
      for (let i = 0; i < db_data.length; i++) {
        data_list[i] = [];
        if (db_data[i].sale_money == null) db_data[i].sale_money = 0;

        data_list[i].push(db_data[i].market_type);
        data_list[i].push(db_data[i].sale_money);
      }

      ret.theader = ['판매 순위', '결제 타입', '판매액'];
      ret.tbody = data_list;
    }
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/

  function chart_make(val) {
    val.chart_option = {
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
    };

    val.chart_data = {};
    val.chart_data.labels = [];
    val.chart_data.datasets = [
      {
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2,
        data: [],
      },
      {
        label: '합계',
        backgroundColor: ginfo.chartAlphaColors.aqua,
        borderColor: ginfo.chartColors.aqua,
        borderWidth: 2,
        data: [],
      },
    ];
  }

  function data_select(logdb) {
    const start_date = body.start_dt + ' 00:00:00';
    const end_date = body.end_dt + ' 23:59:59';

    return new Promise(function (resolve, reject) {
      const query = com.make_query(
        [
          "select 'aft' as market_type, count(idx) as cnt, sum(amount) as sale_money ",
          'from log_payment_aft where transaction_date between ? and ? ',
          'union all ',
          "select 'aos' as market_type, count(idx) as cnt, sum(amount) as sale_money ",
          'from log_payment_aos where reg_dt between ? and ? ',
          'union all ',
          "select 'ios' as market_type, count(idx) as cnt, sum(amount) as sale_money ",
          'from log_payment_ios where reg_dt between ? and ?; ',
        ],
        [start_date, end_date, start_date, end_date, start_date, end_date]
      );

      mysql
        .query(logdb, query, [])
        .then((results) => (results.length ? resolve(results) : resolve()))
        .catch((e) => reject(e));
    });
  }
};

module.exports.cash_item_sales_money_log = async function (body, title, group1, group2) {
  const val = {};
  const ret = [];

  try {
    const logdb = await mysql.logdb_connect(val);

    if (Number(body.log_type) == ginfo.log_type.chart) {
      const labels = await date_select(logdb);
      if (!labels) throw ginfo.string.log_main_01;

      const arr = com.array_division(labels, 30);
      let start = 1;
      let end = 0;

      for (const d of arr) {
        end += d.length;
        const { chart_data, chart_option } = chart_make(`${title} : ${start}~${end}`);
        start += d.length;

        for (let i = 0; i < d.length; i++) {
          const dataset_list = await dataset_select(logdb, d[i]);

          chart_data.labels.push(d[i]);
          let all = 0;

          for (let j = 0; j < dataset_list.length; j++) {
            const obj = dataset_list[j];

            if (obj.market_type == 'aft') chart_data.datasets[0].data.push(obj.sale_money);
            else if (obj.market_type == 'aos') chart_data.datasets[1].data.push(obj.sale_money);
            else if (obj.market_type == 'ios') chart_data.datasets[2].data.push(obj.sale_money);

            all += obj.sale_money;
          }

          chart_data.datasets[3].data.push(all);
        }

        ret.push({
          type: 'bar',
          data: chart_data,
          options: chart_option,
        });
      }
    } else if (Number(body.log_type) == ginfo.log_type.table) {
      const labels = await date_select(logdb);
      if (!labels) throw ginfo.string.log_main_01;

      let data_list = [];
      let all = 0;
      for (let i = 0; i < labels.length; i++) {
        const dataset_list = await dataset_select(logdb, labels[i]);
        data_list[i] = [];

        _.forEach(dataset_list, (obj) => {
          if (obj.sale_money == null) obj.sale_money = 0;

          all += obj.sale_money;
        });

        data_list[i].push(labels[i]);
        data_list[i].push(dataset_list[0].sale_money);
        data_list[i].push(dataset_list[1].sale_money);
        data_list[i].push(dataset_list[2].sale_money);
        data_list[i].push(all);
      }

      ret.theader = ['행번호', '날짜', 'AFT 판매액', 'AOS 판매액', 'IOS 판매액', '총 판매액'];
      ret.tbody = data_list;
    }
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/

  function chart_make(title) {
    const chart_option = {
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      scales: {
        x: [
          {
            stacked: true,
          },
        ],
        y: [
          {
            stacked: true,
          },
        ],
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
    };
    const chart_data = {};
    chart_data.labels = [];
    chart_data.datasets = [
      {
        type: 'bar',
        label: 'AFT 판매액',
        backgroundColor: ginfo.chartAlphaColors.red,
        borderColor: ginfo.chartColors.red,
        borderWidth: 2,
        data: [],
      },
      {
        type: 'bar',
        label: 'AOS 판매액',
        backgroundColor: ginfo.chartAlphaColors.orange,
        borderColor: ginfo.chartColors.orange,
        borderWidth: 2,
        data: [],
      },
      {
        type: 'bar',
        label: 'IOS 판매액',
        backgroundColor: ginfo.chartAlphaColors.blue,
        borderColor: ginfo.chartColors.blue,
        borderWidth: 2,
        data: [],
      },
      {
        type: 'line',
        label: '총 판매액',
        backgroundColor: ginfo.chartAlphaColors.purple,
        borderColor: ginfo.chartColors.purple,
        borderWidth: 2,
        pointRadius: 7,
        pointHoverRadius: 15,
        fill: false,
        data: [],
      },
    ];

    return { chart_option, chart_data };
  }

  function date_select(logdb) {
    const start_date = body.start_dt + ' 00:00:00';
    const end_date = body.end_dt + ' 23:59:59';

    return new Promise(function (resolve, reject) {
      const query = com.make_query(
        [
          `select reg_date from ( `,
          `   select convert(${group1} , char) as reg_date from log_payment_aft `,
          `   where transaction_date between ? and ? `,
          `   group by reg_date `,
          `   union all `,
          `   select convert(${group2} , char) as reg_date from log_payment_aos `,
          `   where reg_dt between ? and ? `,
          `   group by reg_date `,
          `   union all `,
          `   select convert(${group2} , char) as reg_date from log_payment_ios `,
          `   where reg_dt between ? and ? `,
          `   group by reg_date `,
          `) as A group by reg_date; `,
        ],
        [start_date, end_date, start_date, end_date, start_date, end_date]
      );

      mysql
        .query(logdb, query, [])
        .then((results) => (results.length ? resolve(_.map(results, 'reg_date')) : resolve()))
        .catch((e) => reject(e));
    });
  }

  function dataset_select(logdb, date) {
    return new Promise(function (resolve, reject) {
      const query = com.make_query(
        [
          `select 'aft' as market_type, count(idx) as cnt, sum(amount) as sale_money `,
          `from log_payment_aft where ${group1} = ? `,
          `union all  `,
          `select 'aos' as market_type, count(idx) as cnt, sum(amount) as sale_money `,
          `from log_payment_aos where ${group2} = ? `,
          `union all  `,
          `select 'ios' as market_type, count(idx) as cnt, sum(amount) as sale_money  `,
          `from log_payment_ios where ${group2} = ? `,
        ],
        [date, date, date]
      );

      mysql
        .query(logdb, query, [])
        .then((results) => resolve(results))
        .catch((e) => reject(e));
    });
  }
};

module.exports.shop_item_cumulative_sales_log = async function (body, title) {
  const val = {};
  const ret = [];

  try {
    const logdb = await mysql.logdb_connect(val);
    if (Number(body.log_type) == ginfo.log_type.chart) {
      let db_data = await data_select(logdb);
      if (!db_data) throw ginfo.string.log_main_01;

      if (db_data.length > 1)
        db_data.sort((a, b) => {
          return b.sale_cnt - a.sale_cnt;
        });

      const arr = com.array_division(db_data, 30);
      let start = 1;
      let end = 0;
      for (const d of arr) {
        end += d.length;
        const { chart_data, chart_option } = chart_make(`${title} : ${start}~${end}`);
        start += d.length;

        for (let i = 0; i < d.length; i++) {
          const code = d[i].item_code;
          const cnt = d[i].sale_cnt;
          const item_obj = ref.item.get(code);
          const name = item_obj ? item_obj.name : code;

          chart_data.labels.push(name);
          chart_data.datasets[0].data.push(cnt);

          const color = ginfo.chart_color(i);
          chart_data.datasets[0].borderColor.push(ginfo.chartColors[color]);
          chart_data.datasets[0].backgroundColor.push(ginfo.chartAlphaColors[color]);
        }

        ret.push({
          type: 'bar',
          data: chart_data,
          options: chart_option,
        });
      }
    } else if (Number(body.log_type) == ginfo.log_type.table) {
      let db_data = await data_select(logdb);
      if (!db_data) throw ginfo.string.log_main_01;

      if (db_data.length > 1)
        db_data.sort((a, b) => {
          return b.sale_cnt - a.sale_cnt;
        });

      let data_list = [];
      for (let i = 0; i < db_data.length; i++) {
        let code = db_data[i].item_code;
        let cnt = db_data[i].sale_cnt;
        let item_obj = ref.item.get(code);
        let name = item_obj ? item_obj.name : code;

        data_list[i] = [];

        data_list[i].push(name);
        data_list[i].push(cnt);
      }

      ret.theader = ['판매 순위', '아이템명', '판매갯수'];
      ret.tbody = data_list;
    }
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/

  function chart_make(title) {
    const chart_option = {
      indexAxis: 'y',
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
        },
        x: {
          beginAtZero: true,
        },
      },
    };

    const chart_data = {};
    chart_data.labels = [];
    chart_data.datasets = [
      {
        label: '판매갯수',
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2,
        data: [],
      },
    ];

    return { chart_option, chart_data };
  }

  function data_select(logdb) {
    const start_date = body.start_dt + ' 00:00:00';
    const end_date = body.end_dt + ' 23:59:59';

    return new Promise(function (resolve, reject) {
      const query = com.make_query(['select item_code, sum(item_cnt) as sale_cnt from log_buy_item where reg_dt ', 'between ? and ? ', 'group by item_code; '], [start_date, end_date]);

      mysql
        .query(logdb, query)
        .then((results) => {
          if (results.length == 0) reject(ginfo.string.log_main_01);

          resolve(results);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
};

module.exports.gold_distribution_log = async function (body, title) {
  const val = {};
  const ret = [];

  try {
    chart_make(val);

    let datas = [];

    const comdb = await mysql.comdb_connect(val);
    const data = await data_select(comdb);

    for (const d of data) {
      const index = _.findIndex(datas, { name: d.name });
      if (index >= 0) datas[index].cnt += d.cnt;
      else datas.push(d);
    }

    for (let i = 0; i < datas.length; i++) {
      val.chart_data.labels.push(datas[i].name);
      val.chart_data.datasets[0].data.push(datas[i].cnt);

      const color = ginfo.chart_color(i);
      val.chart_data.datasets[0].borderColor.push(ginfo.chartColors[color]);
      val.chart_data.datasets[0].backgroundColor.push(ginfo.chartAlphaColors[color]);
    }

    ret.push({
      type: 'bar',
      data: val.chart_data,
      options: val.chart_option,
    });
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/

  function chart_make(val) {
    val.chart_option = {
      indexAxis: 'y',
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
    };

    val.chart_data = {};
    val.chart_data.labels = [];
    val.chart_data.datasets = [
      {
        label: '유저수',
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2,
        data: [],
      },
    ];
  }

  function data_select(comdb) {
    return new Promise(function (resolve, reject) {
      const query = com.make_query(
        [
          "select count(aidx) as cnt, '1만 이하' as name from dat_money where gold < 10000 ",
          'union all  ',
          "select count(aidx) as cnt, '1만 ~ 10만' as name from dat_money where gold between 10000 and 99999 ",
          'union all  ',
          "select count(aidx) as cnt, '10만 ~ 100만' as name from dat_money where gold between 100000 and 999999 ",
          'union all  ',
          "select count(aidx) as cnt, '100만 ~ 1000만' as name from dat_money where gold between 1000000 and 9999999 ",
          'union all  ',
          "select count(aidx) as cnt, '1000만 ~ 1억' as name from dat_money where gold between 10000000 and 99999999 ",
          'union all  ',
          "select count(aidx) as cnt, '1억 ~ 10억' as name from dat_money where gold between 100000000 and 999999999 ",
          'union all  ',
          "select count(aidx) as cnt, '10억 이상' as name from dat_money where gold >= 1000000000 ; ",
        ],
        []
      );

      mysql
        .query(comdb, query)
        .then((results) => {
          if (results.length == 0) reject(ginfo.string.log_main_01);

          resolve(results);
        })
        .catch((e) => reject(e));
    });
  }
};

module.exports.cubic_distribution_log = async function (body, title) {
  const val = {};
  const ret = [];

  try {
    chart_make(val);

    let datas = [];

    const comdb = await mysql.comdb_connect(val);
    const data = await data_select(comdb);

    for (const d of data) {
      const index = _.findIndex(datas, { name: d.name });
      if (index >= 0) datas[index].cnt += d.cnt;
      else datas.push(d);
    }

    for (let i = 0; i < datas.length; i++) {
      val.chart_data.labels.push(datas[i].name);
      val.chart_data.datasets[0].data.push(datas[i].cnt);

      const color = ginfo.chart_color(i);
      val.chart_data.datasets[0].borderColor.push(ginfo.chartColors[color]);
      val.chart_data.datasets[0].backgroundColor.push(ginfo.chartAlphaColors[color]);
    }

    ret.push({
      type: 'bar',
      data: val.chart_data,
      options: val.chart_option,
    });
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/

  function chart_make(val) {
    val.chart_option = {
      indexAxis: 'y',
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
    };

    val.chart_data = {};
    val.chart_data.labels = [];
    val.chart_data.datasets = [
      {
        label: '유저수',
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2,
        data: [],
      },
    ];
  }

  function data_select(comdb) {
    return new Promise(function (resolve, reject) {
      const query = com.make_query(
        [
          "select count(aidx) as cnt, '1천 이하' as name from dat_money where paid_cubic + free_cubic < 1000 ",
          'union all  ',
          "select count(aidx) as cnt, '1천 ~ 1만' as name from dat_money where paid_cubic + free_cubic between 1000 and 9999 ",
          'union all  ',
          "select count(aidx) as cnt, '1만 ~ 10만' as name from dat_money where paid_cubic + free_cubic between 10000 and 99999 ",
          'union all  ',
          "select count(aidx) as cnt, '10만 ~ 100만' as name from dat_money where paid_cubic + free_cubic between 100000 and 999999 ",
          'union all  ',
          "select count(aidx) as cnt, '100만 ~ 1000만' as name from dat_money where paid_cubic + free_cubic between 1000000 and 9999999 ",
          'union all  ',
          "select count(aidx) as cnt, '1000만 ~ 1억' as name from dat_money where paid_cubic + free_cubic between 10000000 and 99999999 ",
          'union all  ',
          "select count(aidx) as cnt, '1억 이상' as name from dat_money where paid_cubic + free_cubic >= 100000000 ; ",
        ],
        []
      );

      mysql
        .query(comdb, query)
        .then((results) => {
          if (results.length == 0) reject(ginfo.string.log_main_01);

          resolve(results);
        })
        .catch((e) => reject(e));
    });
  }
};

module.exports.new_reg_device_log = async function (body, title) {
  const val = {};
  const ret = {};

  try {
    const logdb = await mysql.logdb_connect(val);
    const cnt = await data_select(logdb);

    ret.msg = `고유 디바이스 유저수 : ${cnt}`;
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/
  function data_select(logdb) {
    const start_date = body.start_dt + ' 00:00:00';
    const end_date = body.end_dt + ' 23:59:59';

    return new Promise(function (resolve, reject) {
      const query = com.make_query(
        ['select COUNT(device_cnt) as device_cnt from ( ', '    select count(uuid) as device_cnt ', '    from log_regid ', '    where reg_dt between ? and ? and uuid not in ( ', '        select uuid from log_regid where reg_dt < ? ', '    ) ', '    group by uuid ', ') as A; '],
        [start_date, end_date, start_date]
      );

      mysql
        .query(logdb, query, [])
        .then((results) => resolve(results[0].device_cnt))
        .catch((e) => reject(e));
    });
  }
};

module.exports.user_retention_log = async function (body, title) {
  const val = {};
  const ret = [];

  try {
    const logdb = await mysql.logdb_connect(val);
    const labels = [];
    for (let i = 0; i < 16; i++) labels.push(`D+${i}`);

    const uuid_list = await base_uuid_select(logdb);
    if (!uuid_list) throw ginfo.string.user_retention_01;

    if (Number(body.log_type) == ginfo.log_type.chart) {
      chart_make(val);

      const dataset_list = [];
      for (let i = 0; i < labels.length; i++) {
        const user_cnt = await dataset_select(logdb, uuid_list, i);
        val.chart_data.labels.push(labels[i]);
        dataset_list.push(user_cnt);
      }

      // 보정 : 먼날짜중에 높은 값이 있으면 가까운날에도 들어온걸로 처리해준다.
      for (let i = dataset_list.length - 1; i >= 0; i--) {
        const user_cnt = dataset_list[i];
        for (let j = 1; j < i; j++) {
          const user_cnt2 = dataset_list[j];
          if (user_cnt2 < user_cnt) dataset_list[j] = user_cnt;
        }
      }

      for (let i = 0; i < dataset_list.length; i++) {
        const user_cnt = dataset_list[i];

        val.chart_data.datasets[0].data.push(user_cnt);
        val.chart_data.datasets[1].data.push(user_cnt);

        const color = ginfo.chart_color(i);
        val.chart_data.datasets[0].borderColor.push(ginfo.chartColors[color]);
        val.chart_data.datasets[0].backgroundColor.push(ginfo.chartAlphaColors[color]);
      }

      ret.push({
        type: 'bar',
        data: val.chart_data,
        options: val.chart_option,
      });
    } else if (Number(body.log_type) == ginfo.log_type.table) {
      let dataset_list = [];
      for (let i = 0; i < labels.length; i++) {
        const user_cnt = await dataset_select(logdb, uuid_list, i);
        dataset_list.push(user_cnt);
      }

      for (let i = dataset_list.length - 1; i >= 0; i--) {
        const user_cnt = dataset_list[i];
        for (let j = 1; j < i; j++) {
          const user_cnt2 = dataset_list[j];
          if (user_cnt2 < user_cnt) dataset_list[j] = user_cnt;
        }
      }

      const data_list = [];
      for (let i = 0; i < dataset_list.length; i++) {
        data_list[i] = [];
        const user_cnt = dataset_list[i];

        data_list[i].push(labels[i]);
        data_list[i].push(user_cnt);
      }

      ret.theader = ['행번호', 'D-Day +', 'UUID'];
      ret.tbody = data_list;
    }
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/

  function chart_make(val) {
    val.chart_option = {
      responsive: true,
      legend: {
        position: 'top',
      },
      plugins: {
        title: {
          display: true,
          text: title,
        },
      },
      scales: {
        x: [
          {
            stacked: true,
          },
        ],
        y: [
          {
            stacked: true,
          },
        ],
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
    };
    val.chart_data = {};
    val.chart_data.labels = [];
    val.chart_data.datasets = [
      {
        type: 'bar',
        label: '유저 로그인 횟수(UUID)',
        backgroundColor: [],
        borderColor: [],
        borderWidth: 2,
        data: [],
      },
      {
        type: 'line',
        label: '유저 로그인 횟수(UUID)',
        backgroundColor: ginfo.chartAlphaColors.purple,
        borderColor: ginfo.chartColors.purple,
        borderWidth: 2,
        pointRadius: 7,
        pointHoverRadius: 15,
        fill: false,
        data: [],
      },
    ];
  }
  function base_uuid_select(logdb) {
    const start_date = body.start_dt + ' 00:00:00';
    const end_date = body.start_dt + ' 23:59:59';
    return new Promise(function (resolve, reject) {
      const query = com.make_query(['select uuid from log_login ', 'where reg_dt between ? and ? ', 'group by uuid; '], [start_date, end_date]);

      mysql
        .query(logdb, query, [])
        .then((results) => (results.length ? resolve(_.map(results, 'uuid')) : resolve()))
        .catch((e) => reject(e));
    });
  }

  function dataset_select(logdb, uuid_list, dplus) {
    const start_date = body.start_dt + ' 00:00:00';
    const end_date = body.start_dt + ' 23:59:59';
    return new Promise(function (resolve, reject) {
      const query = com.make_query(['select count(uuid) as user_cnt from ( ', 'select uuid from log_login', 'where reg_dt between ADDDATE(?,?) and ADDDATE(?,?) ', 'and uuid in (?) group by uuid ', ') as A; '], [start_date, dplus, end_date, dplus, uuid_list]);

      mysql
        .query(logdb, query, [])
        .then((results) => (results.length ? resolve(results[0].user_cnt) : resolve()))
        .catch((e) => reject(e));
    });
  }
};

module.exports.cash_item_buy_user_top100_log = async function (body, title) {
  const val = {};
  const ret = {};

  try {
    const logdb = await mysql.logdb_connect(val);

    val.top_pay_user = {};
    await log_select(logdb, 'log_payment_aft');
    await log_select(logdb, 'log_payment_aos');
    await log_select(logdb, 'log_payment_ios');

    const comdb = await mysql.comdb_connect(val);
    await user_data_select(comdb);

    const pay_user_list = [];
    let cnt = 0;
    for (const d in val.top_pay_user) {
      pay_user_list[cnt] = [];
      pay_user_list[cnt].push(val.top_pay_user[d].aidx);
      pay_user_list[cnt].push(val.top_pay_user[d].name);
      pay_user_list[cnt].push(val.top_pay_user[d].sale);
      pay_user_list[cnt].push(val.top_pay_user[d].id);
      cnt++;
    }

    if (pay_user_list.length > 1)
      // sort desc : idx 3 = sale_money
      pay_user_list.sort((a, b) => {
        return b[2] - a[2];
      });

    ret.theader = ['구매순위', '유저IDX', '이름', '총구매액', '로그인 ID'];
    ret.tbody = pay_user_list;
  } catch (e) {
    val.err = e;
  }

  mysql.release(val);

  return { err: val.err, ret: ret };

  /********************************************************************************************/
  function log_select(logdb, table_name) {
    return new Promise(function (resolve, reject) {
      const query = `select aidx, sum(amount) as sale from ${table_name} group by aidx order by sale desc limit 100;`;

      mysql
        .query(logdb, query, [])
        .then((results) => {
          _.forEach(results, (result) => {
            if (val.top_pay_user[result.aidx] == undefined) val.top_pay_user[result.aidx] = result;
            else val.top_pay_user[result.aidx].sale += result.sale;
          });
          resolve();
        })
        .catch((e) => reject(e));
    });
  }

  function user_data_select(comdb) {
    return new Promise(function (resolve, reject) {
      const aidx_list = _.map(val.top_pay_user, 'aidx');

      if (aidx_list.length == 0) return reject('유료구매 내역이 없습니다.');

      const query = 'select idx as aidx, id, name from dat_account where idx in (?);';

      mysql
        .query(comdb, query, [aidx_list])
        .then((results) => {
          _.forEach(results, (result) => {
            val.top_pay_user[result.aidx].id = result.id;
            val.top_pay_user[result.aidx].name = result.name;
          });
          resolve();
        })
        .catch((e) => reject(e));
    });
  }
};
