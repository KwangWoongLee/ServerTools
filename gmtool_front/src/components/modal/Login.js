import React, { useEffect } from 'react';
import { Modal, Button, InputGroup, Form } from 'react-bootstrap';
import Recoils from 'recoils';
import com, { logger, modal, navigate } from 'util/com';
import { AiFillMail, AiFillLock } from 'react-icons/ai';
import 'styles/Modal.scss';
import request from 'util/request';
import _ from 'lodash';

const LoginModal = () => {
  const [show, setState] = Recoils.useState('MODAL:LOGIN');
  logger.render('LoginModal : ', show);

  useEffect(() => {}, []);

  const onClose = () => {
    modal.alert('success', '경고', '로그인창은 종료 할수 없습니다.');
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const email = e.currentTarget[0].value;
    const password = e.currentTarget[1].value;

    com.storage.setItem('email', email);
    com.storage.setItem('password', password);

    request.post('login', { email, password }).then((ret) => {
      if (!ret.err) {
        com.ref = {};
        com.ref.item = ret.data.ref_item;
        // 유료 메타벅스, 오토박스, basic item, nft item 제외
        com.items = _.values(com.ref.item).filter(
          (i) => i.code !== 3 && i.type !== 3002 && i.type !== 3003 && i.basic !== 1 && i.nft !== 1
        );

        com.storage.setItem('region', ret.data.region);

        setState(false);
        Recoils.setState('CONFIG:ACCOUNT', {
          user: {
            login_id: '',
            nick: '',
            aidx: 0,
            region: 'kor',
          },
          email: ret.data.email,
          grade: ret.data.grade,
          name: ret.data.name,
        });

        Recoils.setState('MODE', { mode: ret.data.mode });

        navigate('/');
        //navigate('/log/graph');
      }
    });

    logger.info(`submit : email = ${email}, password = ${password}`);

    //setState(false);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" backdrop="static" className="Login">
      <Modal.Header>
        <Modal.Title className="text-primary">로그인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit} id="login-modal-form">
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              <AiFillMail />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="id"
              aria-label="id"
              defaultValue={com.storage.getItem('email')}
              aria-describedby="basic-addon1"
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon2">
              <AiFillLock />
            </InputGroup.Text>
            <Form.Control
              type="password"
              placeholder="password"
              aria-label="password"
              defaultValue={com.storage.getItem('password')}
              aria-describedby="basic-addon2"
            />
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit" form="login-modal-form">
          로그인
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(LoginModal);
