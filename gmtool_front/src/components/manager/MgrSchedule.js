import React, { useEffect, useState } from 'react';

import 'styles/Manager.scss';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import com, { logger, modal } from 'util/com';
import { Table, OverlayTrigger, Tooltip, Nav, Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import request from 'util/request';
import DateTimeInput from 'components/common/DateTimeInput';
import moment from 'moment';

const MgrSchedule = () => {
  const [tbl, setTbl] = useState({ cur: {}, tables: [] });
  const [tblData, setTblData] = useState({ columns: [], data: [] });
  const [modal_state, setModalState] = useState({ show: false, title: '', data: [], cb: null });

  logger.render('MgrSchedule :', tbl);

  useEffect(() => {
    request.post('manager/schedule', {}).then((ret) => {
      if (!ret.err) {
        const tables = ret.data;
        const cur = tables.length ? tables[0] : {};
        setTbl(() => ({ cur, tables }));
        request_data(cur.TABLE_NAME);
      }
    });
  }, []);

  const request_data = (table_name) => {
    request.post('manager/schedule/data', { table_name }).then((ret) => {
      if (!ret.err) {
        const { columns, data } = ret.data;
        setTblData({ columns, data });
      }
    });
  };
  const onTableSelect = (table) => {
    setTbl((state) => ({ ...state, cur: table }));
    request_data(table.TABLE_NAME);
  };

  const onInsert = () => {
    const fields = tblData.columns
      .filter((c) => c.name !== 'idx' && c.name !== 'start_dt' && c.name !== 'end_dt')
      .map((c) => ({ name: c.name, value: '' }));

    setModalState({
      show: true,
      title: `${tbl.cur.TABLE_COMMENT} : 추가`,
      data: fields,
      cb: (results) => {
        request
          .post('manager/schedule/insert', { table_name: tbl.cur.TABLE_NAME, column_data: results })
          .then((ret) => {
            if (!ret.err) {
              request_data(tbl.cur.TABLE_NAME);
            }
          });
      },
    });
  };

  const onUpdate = (e) => {
    const nodes = e.currentTarget.parentNode.parentNode.childNodes;
    const idx = nodes[1].innerText;

    const fields = tblData.columns
      .filter((c) => c.name !== 'idx' && c.name !== 'start_dt' && c.name !== 'end_dt')
      .map((c) => ({ name: c.name, value: '' }));

    setModalState({
      show: true,
      title: `${tbl.cur.TABLE_COMMENT} - ${idx} : 수정`,
      data: fields,
      cb: (results) => {
        request
          .post('manager/schedule/update', { table_name: tbl.cur.TABLE_NAME, column_data: results, idx })
          .then((ret) => {
            if (!ret.err) {
              request_data(tbl.cur.TABLE_NAME);
            }
          });
      },
    });
  };

  const onDelete = (e) => {
    const nodes = e.currentTarget.parentNode.parentNode.childNodes;
    const idx = nodes[1].innerText;
    logger.debug('onDelete idx ,', idx);
    request.post('manager/schedule/delete', { table_name: tbl.cur.TABLE_NAME, idx }).then((ret) => {
      if (!ret.err) {
        request_data(tbl.cur.TABLE_NAME);
      }
    });
  };

  return (
    <>
      <Head />
      <Body title="스케쥴">
        <div className="MgrSchedule">
          <Nav fill scrolling variant="tabs">
            {tbl.tables.map((table, key) => (
              <NavItem key={key} cur={tbl.cur} table={table} onTableSelect={onTableSelect} />
            ))}
          </Nav>
          <hr />
          <h4 className="text-primary d-flex justify-content-center">{tbl.cur.TABLE_COMMENT}</h4>
          <hr />
          <Table striped bordered hover>
            <thead>
              <tr>
                {tblData.columns.length !== 0 && (
                  <th>
                    <Button variant="success" onClick={onInsert}>
                      추가
                    </Button>
                  </th>
                )}
                {tblData.columns.map((d, key) => (
                  <TableHead key={key} column={d}></TableHead>
                ))}
              </tr>
            </thead>
            <tbody>
              {tblData.data.map((r, key) => (
                <TableBody key={key} row={r} onUpdate={onUpdate} onDelete={onDelete}></TableBody>
              ))}
            </tbody>
          </Table>
        </div>
        <InputModal modal_state={modal_state} setModalState={setModalState} />
      </Body>
      <Footer />
    </>
  );
};

const NavItem = ({ table, cur, onTableSelect }) => {
  return (
    <Nav.Item>
      <Nav.Link onClick={() => onTableSelect(table)} active={cur.TABLE_NAME === table.TABLE_NAME}>
        {table.TABLE_COMMENT}
      </Nav.Link>
    </Nav.Item>
  );
};

const TableHead = React.memo(({ column }) => {
  logger.render('LogDB - TableHead');
  return (
    <OverlayTrigger
      placement="top"
      overlay={
        <Tooltip>
          <strong>{column.comment}</strong>
        </Tooltip>
      }
    >
      <th>{column.name}</th>
    </OverlayTrigger>
  );
});

const TableBody = React.memo(({ row, onUpdate, onDelete }) => {
  logger.render('LogDB - TableBody', row);
  return (
    <tr>
      <td>
        <Button variant="primary" onClick={onUpdate}>
          수정
        </Button>
        <Button variant="secondary" onClick={onDelete}>
          삭제
        </Button>
      </td>
      {row.map((d, key) => (
        <td key={key}>{d}</td>
      ))}
    </tr>
  );
});

const modal_init_data = () => ({
  start_dt: com.now(-30),
  end_dt: com.now(),
});
const InputModal = React.memo(({ modal_state, setModalState }) => {
  logger.render('MgrSchedule InputModal');
  const [date, setDate] = useState(modal_init_data);
  useEffect(() => {
    if (modal_state.show) setDate(modal_init_data);
  }, [modal_state]);

  const onSubmit = (e) => {
    e.preventDefault();

    const values = [];

    for (let i = 0; i < modal_state.data.length; i++) {
      const { name, value } = e.currentTarget[i];
      if (!value) return modal.alert('info', `${name} 필드의 값이 비었습니다.`);

      values.push({
        name: name,
        value: value,
      });
    }

    values.push({
      name: 'start_dt',
      value: moment(date.start_dt).format('YYYY-MM-DD HH:mm'),
    });
    values.push({
      name: 'end_dt',
      value: moment(date.end_dt).format('YYYY-MM-DD HH:mm'),
    });
    if (modal_state.cb) modal_state.cb(values);
    onClose();
  };

  const onClose = () => setModalState((state) => ({ ...state, show: false }));

  return (
    <Modal show={modal_state.show} onHide={onClose} centered>
      <Modal.Header>
        <Modal.Title className="text-primary">{modal_state.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit} id="modify-recommand-modal-form">
          <>
            {modal_state.data.map((d, key) => (
              <FloatingLabel key={key} label={d.name} className="mb-1">
                <Form.Control type="text" placeholder={key} name={d.name} defaultValue={d.value} />
              </FloatingLabel>
            ))}
            <Form.Label>시작 날짜</Form.Label>
            <DateTimeInput
              selectDate={date.start_dt}
              placeholder="시작 날짜"
              onChange={(d) => setDate({ ...date, start_dt: d })}
            ></DateTimeInput>
            <Form.Label>종료 날짜</Form.Label>
            <DateTimeInput
              selectDate={date.end_dt}
              minDate={com.now()}
              placeholder="종료 날짜"
              onChange={(d) => setDate({ ...date, end_dt: d })}
            ></DateTimeInput>
          </>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" type="submit" form="modify-recommand-modal-form">
          저장
        </Button>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default React.memo(MgrSchedule);
