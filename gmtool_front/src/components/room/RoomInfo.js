import React, { useState, useEffect } from 'react';

import { Table, Button } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { useInput, modal } from 'util/com';
import request from 'util/request';
import UserNavTab from 'components/template/UserNavTab';

import 'styles/Room.scss';

import { logger } from 'util/com';

const RoomInfo = () => {
  logger.render('RoomInfo');

  const [info, setInfo] = useState(null);
  const [state, onChange, dispatch] = useInput({
    id: '',
    name: '',
    nickname: '',
  });

  useEffect(() => {
    request.post(`room/info`, {}).then((ret) => {
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

  return (
    <>
      <Head />
      <Body title={`방 정보`}>
        <UserNavTab active="/user/info" />
        <div className="RoomInfo">
          {info && (
            <>
              <Item info={info} state={state} onChange={onChange} />
            </>
          )}
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
      </tbody>
    </Table>
  );
};

export default React.memo(RoomInfo);
