import React, { useEffect, useState } from 'react';

import 'styles/Manager.scss';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { logger, modal } from 'util/com';

import { Nav, Table, Button } from 'react-bootstrap';

import request from 'util/request';
import _ from 'lodash';

const MgrServerStatus = () => {
  logger.render('MgrServerStatus');
  const [tab, setStab] = useState('iocp');

  useEffect(() => {}, []);

  return (
    <>
      <Head />
      <Body title="서버 상태">
        <div className="MgrServerStatus">
          <Nav fill variant="tabs">
            <Nav.Item>
              <Nav.Link onClick={() => setStab('packet')} active={tab === 'packet'}>
                게임서버 패킷 통계
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setStab('iocp')} active={tab === 'iocp'}>
                IOCP 서버 현황
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setStab('live')} active={tab === 'live'}>
                라이브 월드 현황
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link onClick={() => setStab('play')} active={tab === 'play'}>
                플레이월드 현황
              </Nav.Link>
            </Nav.Item>
          </Nav>
          {tab === 'packet' ? <GamePacket /> : <MatchStatus name={tab} />}
        </div>
      </Body>
      <Footer />
    </>
  );
};

const GamePacket = React.memo(() => {
  const [state, setState] = useState([]);

  useEffect(() => {
    logger.render('mount GamePacket');
    request.post('manager/serstate/packet', {}).then((ret) => {
      if (!ret.err) {
        setState(ret.data);
      }
    });

    return () => {
      logger.render('un mount GamePacket');
    };
  }, []);
  return (
    <div className="GamePacket">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>패킷 코드</th>
            <th>패킷 명</th>
            <th>호출 횟수</th>
            <th>총 처리시간(초)</th>
            <th>최대 처리시간(초)</th>
            <th>최소 처리시간(초)</th>
            <th>평균 처리시간(초)</th>
          </tr>
        </thead>
        <tbody>
          {state.map((d, key) => (
            <tr key={key}>
              <td>{d.cmd}</td>
              <td>{d.key}</td>
              <td>{d.call}</td>
              <td>{d.total}</td>
              <td>{d.max}</td>
              <td>{d.min}</td>
              <td>{d.average}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
});

const get_table_data = (state) => {
  if (state.length === 0) return { columns: [], data: [] };

  const data = [];

  const columns = Object.keys(state[0]);

  _.map(state, (tr) => data.push(_.values(tr)));
  logger.debug('columns = ', columns);
  logger.debug('data = ', data);

  return { columns, data };
};

const MatchStatus = React.memo(({ name }) => {
  logger.render('MatchStatus : ', name);

  const [state, setState] = useState([]);

  useEffect(() => {
    request.post('manager/serstate', {}).then((ret) => {
      if (!ret.err) {
        logger.debug(ret.data[name]);
        setState(ret.data[name]);
      }
    });
  }, [name]);

  const table_data = get_table_data(state);

  return (
    <div className="MatchStatus">
      <Table striped bordered hover>
        <thead>
          <tr>
            {table_data.columns.map((th, key) => (
              <th key={key}>{th}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table_data.data.map((tr, key) => (
            <tr key={key}>
              {tr.map((td, key2) => (
                <td key={key2}>
                  {typeof td === 'object' ? <ObjectView td={td} title={table_data.columns[key2]} /> : td}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
});

const ObjectView = React.memo(({ td, title }) => {
  const onClick = () => {
    modal.alert('success', title, JSON.stringify(td, null, 2));
  };
  return (
    <Button variant="success" onClick={onClick}>
      보기
    </Button>
  );
});

export default React.memo(MgrServerStatus);
