import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Table, Button } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';

import Recoils from 'recoils';
import { logger, navigate } from 'util/com';
import request from 'util/request';
import produce from 'immer';
import { FcDownload } from 'react-icons/fc';

import 'styles/User.scss';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [more, setMore] = useState(false);
  const page = useRef(1);
  const box = useRef(null);
  logger.render('UserList');

  useEffect(() => {
    request_page();
  }, []);

  const onClick = useCallback((e) => {
    logger.debug('name = ', e.currentTarget.name);
    request.post(`user/select`, { aidx: e.currentTarget.name }).then((ret) => {
      if (!ret.err) {
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
      }
    });
  }, []);

  const onMore = () => {
    request_page();
  };

  const request_page = () => {
    request.post(`user/list`, { page: page.current }).then((ret) => {
      if (!ret.err) {
        setMore(() => ret.data.next_page);
        logger.info(ret.data);
        setUsers((users) => produce(users, (d) => d.concat(ret.data.list)));
        page.current++;

        const { scrollHeight, clientHeight } = box.current;
        box.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
      }
    });
  };

  return (
    <>
      <Head />
      <Body title={`유저 리스트`}>
        <div className="UserList" ref={box}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>AIDX</th>
                <th>ID</th>
                <th>실명</th>
                <th>닉네임</th>
                <th>지역</th>
              </tr>
            </thead>
            <tbody>
              {users.map((d, key) => (
                <TableItem key={key} d={d} onClick={onClick} />
              ))}
            </tbody>
          </Table>
        </div>
        {more && (
          <Button variant="outline-success" size="lg" className="more-btn" onClick={onMore}>
            <FcDownload />
            {' 더보기 ...'}
          </Button>
        )}
      </Body>
      <Footer />
    </>
  );
};

const TableItem = React.memo(({ d, onClick }) => {
  logger.render('UserList TableItem : ', d.idx);
  return (
    <tr>
      <td>
        <Button variant="primary" onClick={onClick} name={d.idx}>
          선택
        </Button>
      </td>
      <td>{d.idx}</td>
      <td>{d.id}</td>
      <td>{d.name}</td>
      <td>{d.nickname}</td>
      <td>{d.region}</td>
    </tr>
  );
});

export default React.memo(UserList);
