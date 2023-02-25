import React, { useEffect, useState } from 'react';

import 'styles/Manager.scss';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { logger, modal } from 'util/com';

import { Table, Button, Modal, Form, FloatingLabel, DropdownButton, Dropdown, InputGroup } from 'react-bootstrap';
import request from 'util/request';
import { BsFillPeopleFill } from 'react-icons/bs';
import _ from 'lodash';

const grade_str = ['NONE', 'NORMAL', 'LOGVIEW', 'ADMIN', 'SUPER ADMIN'];

const MgrAccount = () => {
  logger.render('MgrAccount');

  const [accs, setAccs] = useState([]);
  const [modal_state, setModalState] = useState({ show: false, acc: null });

  useEffect(() => {}, []);

  useEffect(() => {
    request_page();
  }, []);

  const request_page = () => {
    request.post('manager/account', {}).then((ret) => {
      if (!ret.err) {
        setAccs(ret.data);
      }
    });
  };

  const onInsert = () => {
    setModalState({ show: true, acc: null });
  };
  const onDelete = (e) => {
    const nodes = e.currentTarget.parentNode.parentNode.childNodes;
    const email = nodes[1].innerText;
    const name = nodes[2].innerText;

    modal.alert('info', `${email}계정 삭제`, `${name} 유저의 계정을 삭제합니다.`, () =>
      request.post(`manager/account/delete`, { email }).then((ret) => {
        if (!ret.err) {
          request_page();
        }
      })
    );
  };

  const onModify = (e) => {
    const nodes = e.currentTarget.parentNode.parentNode.childNodes;
    const email = nodes[1].innerText;

    const acc = _.find(accs, { email });

    logger.debug('select acc : ', acc);

    setModalState({ show: true, acc });
  };

  return (
    <>
      <Head />
      <Body title="툴계정">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>
                <Button variant="success" onClick={onInsert}>
                  추가
                </Button>
              </th>
              <th>EMAIL</th>
              <th>이름</th>
              <th>권한</th>
              <th>생성날짜</th>
            </tr>
          </thead>
          <tbody>
            {accs.map((d, key) => (
              <TableItem key={key} d={d} onModify={onModify} onDelete={onDelete} />
            ))}
          </tbody>
        </Table>
        <InputModal modal_state={modal_state} setModalState={setModalState} request_page={request_page} />
      </Body>
      <Footer />
    </>
  );
};

const TableItem = React.memo(({ d, onModify, onDelete }) => {
  //logger.render('MgrBot TableItem : ', d.aidx);
  return (
    <tr>
      <td>
        <Button variant="primary" onClick={onModify} name={d.idx}>
          수정
        </Button>
        <Button variant="secondary" onClick={onDelete} name={d.idx}>
          삭제
        </Button>
      </td>
      <td>{d.email}</td>
      <td>{d.name}</td>
      <td>{grade_str[d.grade - 1]}</td>
      <td>{d.reg_dt}</td>
    </tr>
  );
});

const InputModal = React.memo(({ modal_state, setModalState, request_page }) => {
  logger.render('MgrAccount InputModal');
  const [grade, setGrade] = useState(0);

  useEffect(() => {
    if (modal_state.show) {
      setGrade(modal_state.acc ? modal_state.acc.grade : 1);
    }
  }, [modal_state]);

  const onSubmit = (e) => {
    e.preventDefault();

    const email = e.currentTarget[0].value;
    const name = e.currentTarget[1].value;
    const password = e.currentTarget[2].value;

    if (!email) return modal.alert('error', '', '이메일 항목이 비었습니다.');
    if (!name) return modal.alert('error', '', '이름 항목이 비었습니다.');
    if (!password) return modal.alert('error', '', '패스워드 항목이 비었습니다.');

    const url = modal_state.acc ? 'manager/account/update' : 'manager/account/insert';
    request.post(url, { email, name, password, grade }).then((ret) => {
      if (!ret.err) {
        request_page();
        onClose();
      }
    });
  };

  const onClose = () => setModalState((state) => ({ ...state, show: false }));

  const onChange = (grade) => {
    setGrade(Number(grade) + 1);
  };

  return (
    <Modal show={modal_state.show} onHide={onClose} centered>
      <Modal.Header className="d-flex justify-content-center">
        <Modal.Title className="text-primary">
          <div>{modal_state.acc ? modal_state.acc.email : '계정 추가'}</div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit} id="acc-form">
          <div>
            <FloatingLabel label="email" className="mb-1">
              <Form.Control
                type="mail"
                placeholder="email"
                disabled={modal_state.acc ? true : false}
                defaultValue={modal_state.acc ? modal_state.acc.email : ''}
              />
            </FloatingLabel>
            <FloatingLabel label="name" className="mb-1">
              <Form.Control type="text" placeholder="name" defaultValue={modal_state.acc ? modal_state.acc.name : ''} />
            </FloatingLabel>
            <FloatingLabel label="password" className="mb-1">
              <Form.Control
                type="password"
                placeholder="password"
                defaultValue={modal_state.acc ? modal_state.acc.password : ''}
              />
            </FloatingLabel>
            <InputGroup>
              <InputGroup.Text id="basic-addon1">
                <DropdownButton
                  variant="dark"
                  title={
                    <>
                      <BsFillPeopleFill />
                      등급
                    </>
                  }
                >
                  {grade_str.map((name, key) => (
                    <Dropdown.Item key={key} eventKey={key} onClick={() => onChange(key)} active={grade - 1 === key}>
                      {grade_str[key]}
                    </Dropdown.Item>
                  ))}
                </DropdownButton>
              </InputGroup.Text>
              <Form.Control type="text" readOnly value={grade_str[grade - 1]} />
            </InputGroup>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit" form="acc-form">
          저장
        </Button>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default React.memo(MgrAccount);
