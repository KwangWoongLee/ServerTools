import React, { useState, useEffect } from 'react';

import { Table, Button } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { useInput, modal } from 'util/com';
import request from 'util/request';
import UserNavTab from 'components/template/UserNavTab';

import 'styles/User.scss';

import { logger } from 'util/com';

const UserInfo = () => {
  logger.render('UserInfo');

  const [info, setInfo] = useState(null);
  const [state, onChange, dispatch] = useInput({
    id: '',
    name: '',
    nickname: '',
  });

  useEffect(() => {
    request.post(`user/info`, {}).then((ret) => {
      if (!ret.err) {
        logger.info(ret.data);
        setInfo(() => ret.data);
      }
    });
  }, []);

  useEffect(() => {
    if (info) {
      dispatch({ name: 'name', value: info.name });
      dispatch({ name: 'nickname', value: info.nickname });
      dispatch({ name: 'id', value: info.id });
    }
  }, [info, dispatch]);

  const onClickUpdate = () => {
    modal.alert('info', '유저 수정', '입력된 데이타로 수정합니다', () =>
      request.post(`user/info/update`, state).then((ret) => {
        if (!ret.err) {
          logger.info(ret.data);
          setInfo(() => ret.data);
          modal.alert('success', '수정 완료', '업데이트가 완료 되었습니다.');
        }
      })
    );
  };

  const onClickKick = () => {
    modal.alert('info', '강제 종료', '선택된 유저를 강제 종료 합니다.', () =>
      request.post(`user/info/kick`, {}).then((ret) => {
        if (!ret.err) {
          modal.alert('success', '종료 완료', '선택 유저가\n강제 종료 되었습니다.');
        }
      })
    );
  };

  const onClickRebirth = () => {
    modal.alert('info', '유저 복구', '선택된 유저를 복구 합니다.', () =>
      request.post(`user/info/rebirth`, {}).then((ret) => {
        if (!ret.err) {
          logger.info(ret.data);
          setInfo(() => ret.data);
          modal.alert('success', '복구 완료', '선택 유저\n복구되었습니다.');
        }
      })
    );
  };

  const onClickDelete = () => {
    modal.alert('info', '유저 삭제', '선택된 유저를 삭제 합니다.', () =>
      request.post(`user/info/delete`, {}).then((ret) => {
        if (!ret.err) {
          logger.info(ret.data);
          setInfo(() => ret.data);
          modal.alert('success', '삭제 완료', '선택 유저가\n삭제되었습니다.');
        }
      })
    );
  };

  return (
    <>
      <Head />
      <Body title={`유저 기본정보`}>
        <UserNavTab active="/user/info" />
        <div className="UserInfo">
          {info && (
            <>
              <div className="d-flex justify-content-around">
                <Button onClick={onClickKick} size="sm" variant="danger">
                  강제종료
                </Button>
                <Button onClick={onClickRebirth} size="sm" variant="success">
                  유저복구
                </Button>
                <Button onClick={onClickDelete} size="sm" variant="warning">
                  유저삭제
                </Button>
              </div>
              <Item info={info} state={state} onChange={onChange} />
            </>
          )}
          <div className="d-flex justify-content-center">
            <Button variant="primary" onClick={onClickUpdate}>
              변경적용
            </Button>
          </div>
        </div>
      </Body>
      <Footer />
    </>
  );
};

const Item = ({ info, state, onChange }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>설명</th>
          <th>컬럼명</th>
          <th>현재값</th>
          <th>변경값</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>계정IDX</td>
          <td>aidx</td>
          <td>{info.idx}</td>
          <td>
            <input type="number" disabled value={info.idx} />
          </td>
        </tr>
        <tr>
          <td>Login ID</td>
          <td>id</td>
          <td>{info.id}</td>
          <td>
            <input type="text" name="id" value={state.id} onChange={onChange} />
          </td>
        </tr>
        <tr>
          <td>실명</td>
          <td>name</td>
          <td>{info.name}</td>
          <td>
            <input type="text" name="name" value={state.name} onChange={onChange} />
          </td>
        </tr>
        <tr>
          <td>닉네임</td>
          <td>nickname</td>
          <td>{info.nickname}</td>
          <td>
            <input type="text" name="nickname" value={state.nickname} onChange={onChange} />
          </td>
        </tr>
        <tr>
          <td>지역</td>
          <td>region</td>
          <td>{info.region}</td>
          <td></td>
        </tr>
      </tbody>
    </Table>
  );
};

export default React.memo(UserInfo);
