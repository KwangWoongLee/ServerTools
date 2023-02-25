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

const UserMoney = () => {
  logger.render('UserMoney');

  const [info, setInfo] = useState(null);
  const [state, onChange, dispatch] = useInput({
    lucci: '0',
  });

  useEffect(() => {
    request.post(`user/money`, {}).then((ret) => {
      if (!ret.err) {
        logger.info();
        setInfo(() => ret.data);
      }
    });
  }, []);

  useEffect(() => {
    if (info) {
      dispatch({ name: 'lucci', value: info.lucci });
    }
  }, [info, dispatch]);

  const onClickUpdate = () => {
    modal.alert('info', '재화 수정', '입력된 데이타로 수정합니다', () =>
      request.post(`user/money/update`, state).then((ret) => {
        if (!ret.err) {
          logger.info(ret.data);
          setInfo(() => ret.data);
          modal.alert('success', '수정 완료', '업데이트가 완료 되었습니다.');
        }
      })
    );
  };

  return (
    <>
      <Head />
      <Body title={`유저 재화`}>
        <UserNavTab active="/user/money" />
        <div className="UserMoney">
          {info && <Item info={info} state={state} onChange={onChange} />}
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
          <th>현재값</th>
          <th>변경값</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>루찌</td>
          <td>{info.lucci}</td>
          <td>
            <input type="number" name="lucci" value={state.lucci} onChange={onChange} />
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default React.memo(UserMoney);
