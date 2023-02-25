import React from 'react';
import { navigate, modal, logger } from 'util/com';
import { Form } from 'react-bootstrap';
import request from 'util/request';
import Recoils from 'recoils';

export const onServerReset = () => {
  modal.confirm('서버 리셋', ['리셋 패스워드를 입력해 주세요.'], ([password]) => {
    modal.alert(
      'error',
      '경고',
      '서버를 정말로 리셋 하시겠습니까?',
      {
        name: 'OK',
        action: () => {
          request.post(`manager/server_reset`, { password }).then((ret) => {
            if (!ret.err) {
              modal.alert('info', '성공', `모든 서버 정보를 리셋 하였습니다.`);
            }
          });
        },
      },
      { name: 'CANCEL' }
    );
  });

  logger.info('server reset');
};

export const onUserKick = () => {
  modal.alert(
    'error',
    '',
    '확인 버튼 클릭시 모든 유저를 킥합니다.',
    () => {
      request.post(`manager/kick`, { uidx: 0 }).then((ret) => {
        if (!ret.error) {
          modal.alert('info', '성공', `모든유저를 킥 하였습니다.`);
        }
      });
    },
    () => logger.info('취소')
  );
  logger.info('user kick');
};

export const onClickLogin = (e) => {
  if (e.currentTarget.name !== '-1') {
    request.post('logout', {}).then((ret) => {
      if (!ret.err) {
        Recoils.resetState('CONFIG:ACCOUNT');
        navigate('/');
      }
    });
  } else {
    modal.login();
  }
};

export const onClickUserSearch = (e) => {
  const { name, innerText } = e.currentTarget;

  logger.debug('target = ', innerText);

  modal.confirm(innerText, innerText, ([value]) => {
    request.post(`user/search`, { name, value }).then((ret) => {
      if (!ret.err) {
        logger.info(ret.data);
        if (ret.data.length === 1) {
          const { idx, name, login_id, region } = ret.data[0];

          Recoils.setState('CONFIG:ACCOUNT', (account) => ({
            ...account,
            user: {
              login_id: login_id,
              nick: name,
              aidx: idx,
              region: region,
            },
          }));

          navigate('/user/info');
        } else {
          modal.user_select(ret.data);
        }
      }
    });
  });
};

export const onLink = (e) => {
  e.preventDefault();
  const href = e.currentTarget.name;
  logger.debug('href : ', href);
  navigate(href);
};

export const onClickMgrMail = () => {
  modal.item_select('all', <ItemInput />, ([name, code, cnt, expire_day]) => {
    modal.alert('info', `모든유저 (${code}) 우편 추가`, `${name}\n을 모든유저에게\n보내겠습니까?`, () =>
      request.post(`manager/mail`, { code, cnt, expire_day }).then((ret) => {
        if (!ret.err) {
          modal.alert('info', '성공', `${name}\n을 모든유저에게\n전송 성공하였습니다.`);
        }
      })
    );
  });
};

export const onClickSendMsg = () => {
  modal.confirm('메세지 보내기', ['AIDX', '메세지'], ([aidx, msg]) => {
    request.post('manager/message/insert', { aidx, msg, send_type: 2 }).then((ret) => {
      if (!ret.err) {
        modal.alert('info', '성공', `${aidx}\n 유저에게 메세지를 전송하였습니다.`);
      }
    });
  });
};

const ItemInput = () => (
  <>
    <Form.Group className="mb-3">
      <Form.Label>갯수</Form.Label>
      <Form.Control type="number" placeholder="갯수" defaultValue="1" />
    </Form.Group>
    <Form.Group className="mb-3">
      <Form.Label>수령기간(일)</Form.Label>
      <Form.Control type="number" placeholder="수령기간" defaultValue="30" />
    </Form.Group>
  </>
);

// type : all , target, world, channel
export const onSendChat = (type) => {
  switch (type) {
    case 'all':
      return modal.confirm('전체 채팅 보내기', ['내용'], ([msg]) => {
        request.post('manager/chat', { type, msg }).then((ret) => {
          if (!ret.err) {
            modal.alert('info', '', '전체 채팅 보내기 완료');
          }
        });
      });
    case 'target':
      return modal.confirm('단일유저 채팅 보내기', ['대상 계정IDX', '내용'], ([target_aidx, msg]) => {
        request.post('manager/chat', { type, target_aidx, msg }).then((ret) => {
          if (!ret.err) {
            modal.alert('info', '', `${target_aidx} 유저 채팅 보내기 완료`);
          }
        });
      });
    case 'world':
      return modal.confirm('월드 채팅 보내기', ['대상 월드키', '내용'], ([world_key, msg]) => {
        request.post('manager/chat', { type, world_key, msg }).then((ret) => {
          if (!ret.err) {
            modal.alert('info', '', `${world_key} 월드 채팅 보내기 완료`);
          }
        });
      });
    case 'channel':
      return modal.confirm('채널 채팅 보내기', ['대상 채널키', '내용'], ([channel_key, msg]) => {
        request.post('manager/chat', { type, channel_key, msg }).then((ret) => {
          if (!ret.err) {
            modal.alert('info', '', `${channel_key} 채널 채팅 보내기 완료`);
          }
        });
      });
    default:
      return;
  }
};
