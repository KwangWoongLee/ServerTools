import React, { useReducer } from 'react';
import Recoils from 'recoils';
import _ from 'lodash';
import moment from 'moment';
import { navigate_ref } from 'components/common/NavigateCtr';
const com = {};
com.storage = window.localStorage;
com.ref = {};
com.items = [];
com.item_type = [
  { name: 'none', value: 0, desc: '모두' },
  { name: 'coustume', value: 1000, desc: '커스텀' },
  { name: 'equip', value: 2000, desc: '장비' },
  { name: 'equip_2_weapon', value: 2101, desc: '무기' },
  { name: 'equip_2_head', value: 2201, desc: '머리' },
  { name: 'equip_2_top', value: 2202, desc: '상의' },
  { name: 'equip_2_under', value: 2203, desc: '하의' },
  { name: 'equip_2_neck', value: 2301, desc: '목걸이' },
  { name: 'equip_2_ear', value: 2302, desc: '귀걸이' },
  { name: 'equip_2_ring', value: 2303, desc: '반지' },
  { name: 'box_n_random', value: 3000, desc: '랜덤박스' },
  { name: 'box_n_all', value: 3001, desc: '랜덤박스2' },
  { name: 'box_select', value: 3004, desc: '선택박스' },
  { name: 'map_normal', value: 4000, desc: '기본맵' },
  { name: 'map_planter', value: 4001, desc: '화분' },
  { name: 'map_pen', value: 4003, desc: '축사' },
  { name: 'map_grain', value: 4004, desc: '경작' },
  { name: 'map_vegetable', value: 4005, desc: '밭' },
  { name: 'map_fruittree', value: 4006, desc: '과수원' },
  { name: 'map_timber', value: 4007, desc: '목재' },
  { name: 'map_mine', value: 4008, desc: '광산' },
  { name: 'map_gather_etc', value: 4009, desc: '기타채집' },
  { name: 'map_stock', value: 4010, desc: '가축' },
  { name: 'map_monster', value: 4011, desc: '몬스터' },
  { name: 'map_gate', value: 4012, desc: '게이트' },
  { name: 'craft_recipe', value: 6000, desc: '제작도안' },
];

com.now = (add_day) => {
  const now = new Date();
  if (add_day) now.setDate(now.getDate() + add_day);

  return now;
};

com.get_json = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

export const storage = null; // localStorage

export const ArrayToTableData = (data) =>
  data.map((tr, idx) => (
    <tr key={idx}>
      {tr.map((td, idx2) => (
        <td key={idx2}>{td}</td>
      ))}
    </tr>
  ));

export const modal = {
  login: () => {
    Recoils.setState('MODAL:LOGIN', true);
  },

  spinner: (visible) => {
    Recoils.setState('SPINEER', visible);
  },

  alert: (type, title, msg, ...act) => {
    const buttons = [];
    if (typeof act[0] === 'function') {
      buttons.push({ key: 0, name: '확인', action: act[0] });
      if (typeof act[1] === 'function') {
        buttons.push({ key: 1, name: '취소', action: act[1] });
      }
    } else {
      _.forEach(act, (d, key) => {
        buttons.push({ key, name: d.name, action: d.action });
      });
    }

    Recoils.setState('ALERT', { show: true, type, title, msg, buttons: buttons.length ? buttons : undefined });
  },

  confirm: (title, values, cb) => {
    Recoils.setState('CONFIRM', { show: true, title, values: typeof values === 'string' ? [values] : values, cb });
  },
  user_select: (user_list) => {
    Recoils.setState('MODAL:USERSELECT', { show: true, user_list });
  },
  item_select: (type, comp, cb) => {
    Recoils.setState('MODAL:ITEMSELECT', { show: true, comp, type, cb });
  },
  file_upload: (url, accept, label, frm_data, cb = null, title = null, multiple = true) => {
    Recoils.setState('MODAL:FILEUPLOAD', { show: true, url, accept, label, frm_data, title, cb, multiple });
  },
};

export const logger = {
  level: {
    render: 5,
    debug: 4,
    info: 3,
    warn: 2,
    error: 1,
  },
  current_level: process.env.REACT_APP_LOGLEVEL,
  str_convert: (str) => (typeof str === 'object' ? JSON.stringify(str) : str),
  get_message: function (...arg) {
    if (arg.length === 1) return this.str_convert(arg[0]);
    const str = _.reduce(arg, (msg, s) => msg.concat(this.str_convert(s)), '');
    return str;
  },
  render: function (...arg) {
    if (process.env.NODE_ENV !== 'development') return;
    if (this.level[this.current_level] < this.level.render) return;

    const message = this.get_message(...arg);
    console.log('\x1b[35m%s\x1b[0m', `RENDER [${moment().format('YYYY-MM-DD HH:mm:ss')}] : ${message}`);
  },
  debug: function (...arg) {
    if (process.env.NODE_ENV !== 'development') return;
    if (this.level[this.current_level] < this.level.debug) return;

    const message = this.get_message(...arg);
    console.log('\x1b[34m%s\x1b[0m', `DEBUG [${moment().format('YYYY-MM-DD HH:mm:ss')}] : ${message}`);
  },

  info: function (...arg) {
    if (process.env.NODE_ENV !== 'development') return;
    if (this.level[this.current_level] < this.level.info) return;

    const message = this.get_message(...arg);
    console.log('\x1b[32m%s\x1b[0m', `INFO [${moment().format('YYYY-MM-DD HH:mm:ss')}] : ${message}`);
  },

  warn: function (...arg) {
    if (process.env.NODE_ENV !== 'development') return;
    if (this.level[this.current_level] < this.level.warn) return;

    const message = this.get_message(...arg);
    console.log('\x1b[33m%s\x1b[0m', `WARN [${moment().format('YYYY-MM-DD HH:mm:ss')}] : ${message}`);
  },

  error: function (...arg) {
    if (process.env.NODE_ENV !== 'development') return;
    if (this.level[this.current_level] < this.level.error) return;

    const message = this.get_message(...arg);
    console.log('\x1b[31m%s\x1b[0m', `ERROR [${moment().format('YYYY-MM-DD HH:mm:ss')}] : ${message}`);
  },
};

const input_reducer = (state, action) => ({
  ...state,
  [action.name]: action.value,
});

export const useInput = (init) => {
  const [state, dispatch] = useReducer(input_reducer, init);
  const onChange = (e) => {
    dispatch(e.target);
  };
  return [state, onChange, dispatch];
};

export const navigate = (path) => {
  const pathname = navigate_ref.current.location.pathname;
  //console.log('pathname : ', pathname, ', arg : ', path);
  if (pathname === path) page_reload();
  else navigate_ref.current.navigate(path);
};

export const page_reload = () => {
  const pathname = navigate_ref.current.location.pathname;
  navigate_ref.current.navigate('/empty');
  setTimeout(() => navigate_ref.current.navigate(pathname), 1);
};

export default com;
