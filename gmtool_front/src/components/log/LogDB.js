import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';

import 'styles/Log.scss';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import com, { logger, modal } from 'util/com';
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Table,
  OverlayTrigger,
  Tooltip,
  InputGroup,
  Form,
  Modal,
  Button,
} from 'react-bootstrap';
import DateInput from 'components/common/DateInput';
import request from 'util/request';

import moment from 'moment';
import { saveAs } from 'file-saver';

import { FcBusinessman, FcDownload } from 'react-icons/fc';

import _ from 'lodash';

const LogDB = () => {
  const [tbl, setTbl] = useState([]);
  const [tblData, setTblData] = useState({ columns: [], data: [], title: '' });
  const [more, setMore] = useState(false);
  const modal_ref = useRef(null);
  const select_data = useRef({ title: '', query: '', start_dt: '', end_dt: '', aidx: 0, page: 1 });
  const box = useRef(null);

  logger.render('LogDB :', tbl);

  useEffect(() => {
    request.post('log/db', {}).then((ret) => {
      if (!ret.err) {
        setTbl(() => ret.data);
      }
    });
  }, []);

  const modal_Confirm = (start_dt, end_dt, aidx) => {
    logger.info('confirm : ', start_dt, end_dt, aidx);
    select_data.current.start_dt = start_dt;
    select_data.current.end_dt = end_dt;
    select_data.current.aidx = aidx;

    setTblData((state) => ({
      ...state,
      title: `${state.title} : ${start_dt}~${end_dt}`,
    }));

    request_page();
  };

  const onMore = () => {
    request_page();
  };

  const request_page = () => {
    const { query, page, start_dt, end_dt, aidx } = select_data.current;
    request.post('log/db/data', { query, page, start_dt, end_dt, aidx }).then((ret) => {
      if (!ret.err) {
        setTblData((state) => ({
          ...state,
          data: state.data.concat(ret.data.list),
        }));

        select_data.current.page++;
        setMore(() => ret.data.next_page);

        const { scrollHeight, clientHeight } = box.current;
        box.current.scrollTo({ top: scrollHeight - clientHeight, behavior: 'smooth' });
      }
    });
  };

  const onTableSelect = (name, comment) => {
    request.post('log/db/column', { table_name: name }).then((ret) => {
      if (!ret.err) {
        modal_ref.current.show(name);
        setTblData({
          columns: ret.data.columns,
          data: [],
          title: comment,
        });
        select_data.current.page = 1;
        select_data.current.query = ret.data.query;
        setMore(() => false);
      }
    });
  };

  const save = () => {
    const csv = [];
    const header = _.map(tblData.columns, (d) => d.name);
    csv.push(_.join(header, ','));
    _.forEach(tblData.data, (tr) => {
      csv.push(
        _.join(
          tr.map((td) => _.replace(td, /,/g, '')),
          ','
        )
      );
    });

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + _.join(csv, '\n')], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${tblData.title}.csv`);
  };
  const onClickDownLoad = () => {
    modal.alert(
      'info',
      '파일저장',
      `${tblData.title}.csv\n파일을 저장 하시겠습니까?\n선택한 모든날짜의 데이타를 저장 하려면\n더보기 버튼이 나오지 않을때까지\n데이타를 읽어주세요`,
      save
    );
  };

  return (
    <>
      <Head />
      <Body title="DB 로그">
        <Container fluid className="LogDB">
          <Row>
            <Col xs={2} className="Left">
              <Card>
                <Card.Header className="text-primary">로그 이름</Card.Header>
                <ListGroup variant="flush">
                  {tbl.map((t, key) => (
                    <LogItem key={key} table={t} onTableSelect={onTableSelect} />
                  ))}
                </ListGroup>
              </Card>
            </Col>
            <Col xs={10} className="Right">
              <h4 className="text-primary d-flex justify-content-center">{tblData.title}</h4>
              <div className="TableData" ref={box}>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      {tblData.columns.length !== 0 && (
                        <th>
                          <Button
                            className="rounded-circle"
                            variant="outline-primary"
                            size="sm"
                            onClick={onClickDownLoad}
                          >
                            <FcDownload />
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
                      <TableBody key={key} row_num={key + 1} row={r}></TableBody>
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
              {!more && <hr />}
            </Col>
          </Row>
        </Container>
        <DateSelectModal ref={modal_ref} onConfirm={modal_Confirm} />
      </Body>
      <Footer />
    </>
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

const TableBody = React.memo(({ row, row_num }) => {
  logger.render('LogDB - TableBody');
  return (
    <tr>
      <td>{row_num}</td>
      {row.map((d, key) => (
        <td key={key}>{d}</td>
      ))}
    </tr>
  );
});

const LogItem = React.memo(({ table, onTableSelect }) => {
  logger.render('LogDB - LogItem');
  return (
    <OverlayTrigger
      placement={'right'}
      overlay={
        <Tooltip>
          <strong>{table.TABLE_NAME}</strong>.
        </Tooltip>
      }
    >
      <ListGroup.Item onClick={() => onTableSelect(table.TABLE_NAME, table.TABLE_COMMENT)}>
        <small className="text-success">{table.TABLE_COMMENT}</small>
      </ListGroup.Item>
    </OverlayTrigger>
  );
});

const modal_init_data = () => ({
  show: false,
  title: '',
  start_dt: com.now(-30),
  end_dt: com.now(),
  aidx: 0,
});
const DateSelectModal = forwardRef(({ onConfirm }, ref) => {
  logger.render('LogDB - DateSelectModal');
  const [state, setState] = useState(modal_init_data);

  useImperativeHandle(ref, () => ({
    show: (title) => {
      setState({ ...state, show: true, title });
    },
  }));

  const onClose = () => {
    setState(() => modal_init_data());
  };
  const onSubmit = (e) => {
    e.preventDefault();

    onConfirm(moment(state.start_dt).format('YYYY-MM-DD'), moment(state.end_dt).format('YYYY-MM-DD'), state.aidx);
    onClose();
  };

  return (
    <Modal show={state.show} onHide={onClose} size="sm" backdrop="static">
      <Modal.Header className="d-flex justify-content-center">
        <Modal.Title className="text-primary">{state.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit} id="date-modal-form">
          <Form.Label>시작 날짜</Form.Label>
          <DateInput
            selectDate={state.start_dt}
            maxDate={state.end_dt}
            placeholder="시작날짜"
            onChange={(date) => setState({ ...state, start_dt: date })}
          />
          <Form.Label>끝 날짜</Form.Label>
          <DateInput
            selectDate={state.end_dt}
            minDate={state.start_dt}
            placeholder="끝날짜"
            onChange={(date) => setState({ ...state, end_dt: date })}
          />
          <Form.Label>AIDX</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">
              <FcBusinessman />
            </InputGroup.Text>
            <Form.Control
              type="number"
              placeholder="AIDX"
              aria-label="AIDX"
              onChange={(e) => setState({ ...state, aidx: e.currentTarget.value })}
              defaultValue={state.aidx}
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center">
        <Button variant="primary" type="submit" form="date-modal-form">
          확인
        </Button>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default React.memo(LogDB);
