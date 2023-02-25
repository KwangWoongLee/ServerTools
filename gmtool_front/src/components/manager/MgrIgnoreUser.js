import React, { useEffect, useState } from 'react';

import 'styles/Manager.scss';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { logger, modal } from 'util/com';

import { Table, Button } from 'react-bootstrap';
import request from 'util/request';
const MgrIgnoreUser = () => {
  logger.render('MgrIgnoreUser');

  const [ips, setIPs] = useState([]);

  useEffect(() => {
    request_page();
  }, []);

  const request_page = () => {
    request.post('manager/ignore_user', {}).then((ret) => {
      if (!ret.err) {
        setIPs(ret.data);
      }
    });
  };

  const onInsert = () => {
    modal.confirm('점검무시 계정추가', ['IP', '설명'], ([ip, desc]) => {
      request.post('manager/ignore_user/insert', { ip, desc }).then((ret) => {
        if (!ret.err) {
          request_page();
        }
      });
    });
  };
  const onDelete = (e) => {
    const nodes = e.currentTarget.parentNode.parentNode.childNodes;
    const ip = nodes[1].innerText;

    modal.alert('info', 'IP 삭제', '선택한 IP를 삭제합니다.', () =>
      request.post(`manager/ignore_user/delete`, { ip }).then((ret) => {
        if (!ret.err) {
          request_page();
        }
      })
    );
  };

  return (
    <>
      <Head />
      <Body title="점검 무시IP">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <Button variant="success" onClick={onInsert}>
                  추가
                </Button>
              </th>
              <th>IP</th>
              <th>설명</th>
            </tr>
          </thead>
          <tbody>
            {ips.map((d, key) => (
              <tr key={key}>
                <td>
                  <Button variant="secondary" onClick={onDelete} name={d.idx}>
                    삭제
                  </Button>
                </td>
                <td>{d.ip}</td>
                <td>{d.desc}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Body>
      <Footer />
    </>
  );
};

export default React.memo(MgrIgnoreUser);
