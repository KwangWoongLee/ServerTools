import React, { useEffect, useState, useRef } from 'react';
import { Modal, Button, Form, Stack, Dropdown, Table, Container, Row, Col } from 'react-bootstrap';
import Recoils from 'recoils';
import com, { logger, useInput, modal } from 'util/com';
import 'styles/Modal.scss';
import _ from 'lodash';

// 나중에 react-virtualized 혹은 react-window 이용해서 가상화 해주자, 너무 느리다.

const ItemSelectModal = () => {
  const [state, setState] = Recoils.useState('MODAL:ITEMSELECT');
  const [type_idx, setTypeIdx] = useState(0);
  const [txt, onChange] = useInput({ filter: '' });

  const frm = useRef(null);

  logger.render('ItemSelectModal : ', state.show);

  useEffect(() => {}, []);

  const onClose = () => {
    setTypeIdx(0);
    setState({ ...state, show: false, type: undefined, cb: undefined });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const rets = [];
    for (let i = 0; i < frm.current.length - 1; i++) {
      const { value, placeholder, type } = frm.current[i];
      if (!value) return modal.alert('error', `${placeholder} 값이 입력되지 않았습니다.`);
      rets.push(type === 'number' ? Number(value) : value);
    }

    if (state.cb) state.cb(rets);

    onClose();
  };

  const onSelect = (e) => {
    const nodes = e.currentTarget.parentNode.parentNode.childNodes;
    const code = nodes[1].innerText;
    //const type = nodes[2].innerText;
    const name = nodes[3].innerText;

    logger.debug(frm.current.length);
    frm.current[1].value = code;
    frm.current[0].value = name;
  };

  const onTypeClick = (e) => {
    const dst_idx = Number(e.currentTarget.name);
    if (type_idx !== dst_idx) setTypeIdx(dst_idx);
  };

  const items = get_items(state.type, type_idx, txt.filter);

  return (
    <Modal show={state.show} onHide={onClose} backdrop="static" dialogClassName="modal-90w" className="ItemSelect">
      <Modal.Header closeButton>
        <Modal.Title className="text-primary">
          <h4>아이템 선택</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col xs={9}>
              <Row className="mb-3">
                <Col xs={9}>
                  <Form.Control
                    type="text"
                    placeholder="아이템 필터"
                    name="filter"
                    defaultValue={txt.filter}
                    onChange={onChange}
                  />
                </Col>
                <Col xs={3}>
                  <Stack direction="horizontal" gap={1}>
                    <Dropdown>
                      <Dropdown.Toggle variant="success">아이템 타입</Dropdown.Toggle>
                      <Dropdown.Menu>
                        {com.item_type.map((d, key) => (
                          <Dropdown.Item key={key} name={key} onClick={onTypeClick}>
                            {d.desc}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <Form.Control type="text" value={com.item_type[type_idx].desc} disabled />
                  </Stack>
                </Col>
              </Row>
              <Row>
                <hr />
              </Row>
              <div className="TableBody">
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>코드</th>
                      <th>타입</th>
                      <th>이름</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((d) => (
                      <TableItem key={d.code} item={d} onSubmit={onSubmit} onSelect={onSelect} />
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col xs={3}>
              <Form ref={frm} onSubmit={onSubmit} id="item-modal-form">
                <Form.Group className="mb-3">
                  <Form.Label>이름</Form.Label>
                  <Form.Control type="text" placeholder="이름" disabled />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>코드</Form.Label>
                  <Form.Control type="number" placeholder="코드" disabled />
                </Form.Group>
                {state.comp}
              </Form>
              <hr />
              <div className="d-flex justify-content-around">
                <Button variant="primary" type="submit" form="item-modal-form">
                  선택
                </Button>
                <Button variant="secondary" onClick={onClose}>
                  취소
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

const TableItem = React.memo(({ item, onSelect }) => {
  logger.render('ItemSelect TableItem : ', item.code);

  return (
    <tr>
      <td>
        <Button variant="primary" onClick={onSelect}>
          선택
        </Button>
      </td>
      <td>{item.code}</td>
      <td>{item.type}</td>
      <td>{item.name}</td>
    </tr>
  );
});

const get_items = (type, type_idx, filter) => {
  // 대분류 중복 필터
  const first = _.filter(com.items, (i) => {
    if (type === 'all') return true;
    else if (type === 'overlap') return i.overlap === 1 && i.type !== 9901;
    else if (type === 'unique') return i.overlap === 0 && i.type !== 9901;

    return false;
  });

  // 중분류 타입 필터
  const second = _.filter(first, (i) => {
    if (type_idx === 0) return true;
    if (com.item_type[type_idx].value === i.type) return true;

    return false;
  });

  // 소문뷰 텍스트 필터
  const items = _.filter(second, (i) => {
    if (filter.length === 0) return true;
    if (String(i.code).indexOf(filter) >= 0) return true;
    if (String(i.type).indexOf(filter) >= 0) return true;
    if (i.name.indexOf(filter) >= 0) return true;
    return false;
  });

  return items;
};

export default React.memo(ItemSelectModal);
