import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Table, Button } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';

import Recoils from 'recoils';
import com, { logger, navigate, modal } from 'util/com';

import request from 'util/request';
import produce from 'immer';
import { FcDownload } from 'react-icons/fc';

import 'styles/Room.scss';

const RoomList = () => {
  const account = Recoils.useValue('CONFIG:ACCOUNT');
  const aidx = account.user.aidx;
  const region = account.user.region;

  const [rooms, setRooms] = useState([]);
  const [more, setMore] = useState(false);
  const page = useRef(1);
  const box = useRef(null);

  logger.render('RoomList');

  useEffect(() => {
    request_page();
  }, []);

  const onClick = useCallback((e) => {
    logger.debug('roomid = ', e.currentTarget.name);
    request.post(`room/select`, { aidx, room_id: e.currentTarget.name }).then((ret) => {
      if (!ret.err) {
        const { roomkey } = ret.data;
        modal.alert('success', '룸키 생성 완료', `다음 룸키로 접속하세요. \n ${roomkey}`);
      }
    });
  }, []);

  const onMore = () => {
    request_page();
  };

  const request_page = () => {
    request.post(`room/list`, { page: page.current, region }).then((ret) => {
      if (!ret.err) {
        setMore(() => ret.data.next_page);
        logger.info(ret.data);
        setRooms((rooms) => produce(rooms, (d) => d.concat(ret.data.list)));
        page.current++;

        const { scrollHeight, clientHeight } = box.current;
        box.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
      }
    });
  };

  return (
    <>
      <Head />
      <Body title={`${region} 지역 - 방 목록`}>
        <div className="RoomList" ref={box}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>방 ID</th>
                <th>방제</th>
                <th>맵</th>
                <th>최대인원</th>
                <th>최소인원</th>
                <th>잠금상태</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((d, key) => (
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
  logger.render('RoomList TableItem : ', d.roomId.low);
  return (
    <tr>
      <td>
        <Button variant="primary" onClick={onClick} name={d.roomId.low}>
          접속
        </Button>
      </td>
      <td>{d.roomId.low}</td>
      <td>{d.title}</td>
      <td>{d.mapId}</td>
      <td>{d.maxMemberCount}</td>
      <td>{d.minMemberCount}</td>
      <td>{d.locked}</td>
    </tr>
  );
});

export default React.memo(RoomList);
