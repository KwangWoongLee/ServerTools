import React, { useEffect, useState } from 'react';

import { Table, Modal, Button, Form, FloatingLabel, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { logger, modal } from 'util/com';
import request from 'util/request';
import _ from 'lodash';

import 'styles/Manager.scss';
import 'styles/Modal.scss';

const inspect_str = ['서비스중', '점검중'];
const account_str = ['생성 불가능', '생성 가능'];
const login_str = ['불가능', '가능'];

const MgrVersion = () => {
  logger.render('MgrVersion');

  const [datas, setDatas] = useState(null);
  const [modalState, setModalState] = useState({ show: false });

  useEffect(() => {
    request.post('manager/version', {}).then((ret) => {
      if (!ret.err) {
        setDatas(() => ret.data);
      }
    });
  }, []);

  const onModify = (e) => {
    const nodes = e.currentTarget.parentNode.parentNode.childNodes;
    const os_type = nodes[1].innerText;
    let os_index = 1;
    if (os_type === 'AOS') os_index = 1;
    if (os_type === 'IOS') os_index = 2;
    if (os_type === 'PC') os_index = 3;
    const data = _.find(datas, { os_type: Number(os_index) });

    setModalState({ title: `${os_type} 변경`, show: true, data: data });
  };

  const onModalSave = (e) => {
    e.preventDefault();

    const data = {
      os_type: Number(e.currentTarget[0].value),
      version: e.currentTarget[1].value,
      inspect: Number(_.indexOf(inspect_str, e.currentTarget[3].value)),
      account: Number(_.indexOf(account_str, e.currentTarget[5].value)),
      login: Number(_.indexOf(login_str, e.currentTarget[7].value)),
      notice_page: e.currentTarget[8].value,
      inspect_page: e.currentTarget[9].value,
      help_page: e.currentTarget[10].value,
    };

    if (data.inspect !== 0 && data.inspect !== 1) {
      modal.alert('error', '점검 변수를 확인해 주세요.');
      return;
    }

    if (data.account !== 0 && data.account !== 1) {
      modal.alert('error', '계정생성 변수를 확인해 주세요.');
      return;
    }

    if (data.login !== 0 && data.login !== 1) {
      modal.alert('error', '로그인 변수를 확인해 주세요.');
      return;
    }

    request.post('manager/version/update', { data }).then((ret) => {
      if (!ret.err) {
        setDatas(() => ret.data);
        onModalClose(null);
        modal.alert('success', '업데이트완료', '버전및 점검관련 정보가 업데이트 되었습니다.');
      }
    });
  };

  const onModalClose = (e) => {
    setModalState({ show: false });
  };

  return (
    <>
      <Head />
      <Body title="버전및접속 관리">
        <div className="MgrVersion">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th />
                <th>운영체제</th>
                <th>버전</th>
                <th>점검</th>
                <th>로그인</th>
                <th>계정생성</th>
                <th>공지 URL</th>
                <th>점검 URL</th>
                <th>help URL</th>
              </tr>
            </thead>
            <tbody>{datas && datas.map((d, key) => <TableItem key={key} d={d} onModify={onModify} />)}</tbody>
          </Table>
        </div>
      </Body>
      <Footer />
      <MgrVersionModal state={modalState} onSubmit={onModalSave} onClose={onModalClose} />
    </>
  );
};

const TableItem = React.memo(({ d, onModify }) => {
  //logger.render('OpenWorld TableItem : ', d.idx);
  const [labels, setLabels] = useState({});
  useEffect(() => {
    let os_type = 'OTHER';
    if (d.os_type === 1) os_type = 'AOS';
    if (d.os_type === 2) os_type = 'IOS';
    if (d.os_type === 3) os_type = 'PC';

    setLabels({
      os_type,
    });
  }, [d]);
  return (
    <tr>
      <td>
        <Button variant="primary" onClick={onModify} name={d.world_code}>
          수정
        </Button>
      </td>
      <td>{labels.os_type}</td>
      <td>{d.version}</td>
      <td>{d.inspect === 1 ? '점검중' : '서비스중'}</td>
      <td>{d.login === 1 ? '로그인가능' : '로그인불가능'}</td>
      <td>{d.account === 1 ? '생성가능' : '생성불가능'}</td>
      <td>{d.notice_page}</td>
      <td>{d.inspect_page}</td>
      <td>{d.help_page}</td>
    </tr>
  );
});

const MgrVersionModal = React.memo(({ state, onSubmit, onClose }) => {
  if (state.show) logger.render('Exchange ModifyModal');

  const [flag, setFlag] = useState({ inspect: 0, account: 0, login: 0 });

  useEffect(() => {
    if (state.data) setFlag({ inspect: state.data.inspect, account: state.data.account, login: state.data.login });
  }, [state]);

  const onChangeInspect = (inspect) => {
    setFlag({ ...flag, inspect: inspect });
  };

  const onChangeAccount = (account) => {
    setFlag({ ...flag, account: account });
  };

  const onChangeLogin = (login) => {
    setFlag({ ...flag, login: login });
  };

  return (
    <Modal show={state.show} onHide={onClose} centered className="MgrVersionModal">
      {state.title && (
        <Modal.Header>
          <Modal.Title className="text-primary">{state.title}</Modal.Title>
        </Modal.Header>
      )}
      <Modal.Body>
        <Form onSubmit={onSubmit} id="modify-coin-exchange-modal-form">
          {state.data && (
            <>
              <FloatingLabel label="운영체제" className="mb-1">
                <Form.Control type="number" disabled={true} defaultValue={state.data.os_type} />
              </FloatingLabel>
              <FloatingLabel label="버전" className="mb-1">
                <Form.Control type="text" placeholder="1" defaultValue={state.data.version} />
              </FloatingLabel>

              <InputGroup>
                <DropdownButton drop="end" title="점검">
                  {inspect_str.map((name, key) => (
                    <Dropdown.Item
                      key={key}
                      eventKey={key}
                      onClick={() => onChangeInspect(key)}
                      active={flag.inspect === key}
                    >
                      {inspect_str[key]}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <Form.Control
                  className={!flag.inspect ? 'bg-white' : 'bg-warning'}
                  type="text"
                  readOnly
                  value={inspect_str[flag.inspect]}
                />
              </InputGroup>

              <InputGroup>
                <DropdownButton drop="end" title="계정생성">
                  {account_str.map((name, key) => (
                    <Dropdown.Item
                      key={key}
                      eventKey={key}
                      onClick={() => onChangeAccount(key)}
                      active={flag.account === key}
                    >
                      {account_str[key]}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <Form.Control
                  className={flag.account ? 'bg-white' : 'bg-warning'}
                  type="text"
                  readOnly
                  value={account_str[flag.account]}
                />
              </InputGroup>

              <InputGroup>
                <DropdownButton drop="end" title="로그인">
                  {login_str.map((name, key) => (
                    <Dropdown.Item
                      key={key}
                      eventKey={key}
                      onClick={() => onChangeLogin(key)}
                      active={flag.login === key}
                    >
                      {login_str[key]}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
                <Form.Control
                  className={flag.login ? 'bg-white' : 'bg-warning'}
                  type="text"
                  readOnly
                  value={login_str[flag.login]}
                />
              </InputGroup>

              <FloatingLabel label="공지 URL" className="mb-1">
                <Form.Control type="text" placeholder="5" defaultValue={state.data.notice_page} />
              </FloatingLabel>
              <FloatingLabel label="점검 URL" className="mb-1">
                <Form.Control type="text" placeholder="6" defaultValue={state.data.inspect_page} />
              </FloatingLabel>
              <FloatingLabel label="help URL" className="mb-1">
                <Form.Control type="text" placeholder="7" defaultValue={state.data.help_page} />
              </FloatingLabel>
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit" form="modify-coin-exchange-modal-form">
          저장
        </Button>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default React.memo(MgrVersion);
