import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from 'react';

import 'styles/Log.scss';
import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import com, { logger, modal } from 'util/com';
import { Container, Row, Col, ListGroup, Accordion, Badge, Form, Modal, Button, Table, Card } from 'react-bootstrap';
import graph_data from 'util/graph_data';

import moment from 'moment';
import { saveAs } from 'file-saver';

import DateInput from 'components/common/DateInput';
import request from 'util/request';
import { FcDownload } from 'react-icons/fc';
import _ from 'lodash';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
  registerables as registerablesJS,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Filler,
  Title,
  Tooltip,
  Legend
);
ChartJS.register(...registerablesJS);

const LogGraph = () => {
  logger.render('LogGraph');
  const [graphs, setGraphs] = useState(null);
  const modal_ref = useRef(null);

  useEffect(() => {}, []);

  const onClickData = (data) => {
    logger.debug(data);
    modal_ref.current.show(data);
  };

  const modal_Confirm = (start_dt, end_dt, log_name) => {
    logger.info('confirm : ', start_dt, end_dt);
    request.post('log/graph', { start_dt, end_dt, log_name }).then((ret) => {
      if (!ret.err) {
        setGraphs(() => ret.data);
      }
    });
  };

  return (
    <>
      <Head />
      <Body title="집계 로그">
        <Container fluid className="LogGraph">
          <Row>
            <Col xs={3} className="Left">
              <Accordion defaultActiveKey={['1']}>
                {graph_data.map((data) => (
                  <GraphData key={data.id} data={data} onClickData={onClickData} />
                ))}
              </Accordion>
            </Col>
            <Col xs={9} className="Right">
              {graphs && <GraphDraw graphs={graphs} />}
            </Col>
          </Row>
        </Container>
        <DateSelectModal ref={modal_ref} onConfirm={modal_Confirm} />
      </Body>
      <Footer />
    </>
  );
};

const GraphDraw = React.memo(({ graphs }) => {
  logger.render('LogGraph - GraphDraw');

  const onChartClick = (e) => {
    logger.debug(e.currentTarget.toDataURL('image/png'));
    const title = graphs.title;

    e.currentTarget.toBlob((blob) => {
      modal.alert('info', '다운로드', `${title}.png\n파일을 다운로드 합니까?`, () => saveAs(blob, `${title}.png`));
    });
  };

  const save = () => {
    const csv = [];
    csv.push(_.join(graphs.theader, ','));
    _.forEach(graphs.tbody, (tr, key) => {
      tr.unshift(key + 1); // 모든 필드에 넘버링이 들어가네
      csv.push(_.join(tr, ','));
    });
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + _.join(csv, '\n')], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `${graphs.title}.csv`);
  };
  const onClickDownLoad = () => {
    modal.alert('info', '파일저장', `${graphs.title}.csv\n파일을 저장 하시겠습니까?`, save);
  };

  return (
    <>
      {graphs.type === 'chart' &&
        graphs.data.map((graph, key) => (
          <div key={key} className="mb-3">
            <MyChart
              title={graphs.title}
              type={graph.type}
              data={graph.data}
              options={graph.options}
              onClick={onChartClick}
            />
          </div>
        ))}
      {graphs.type === 'table' && (
        <div>
          <div className="d-flex justify-content-between mt-2">
            <h4 className="text-primary">{graphs.title}</h4>
            <Button variant="success" onClick={onClickDownLoad}>
              <FcDownload /> 다운로드
            </Button>
          </div>

          <Table striped bordered hover>
            <thead>
              <tr>
                {graphs.theader.map((h, key) => (
                  <th key={key}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {graphs.tbody.map((r, key) => (
                <tr key={key}>
                  <td>{key + 1}</td>
                  {r.map((d, id) => (
                    <td key={id}>{d}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {graphs.type === 'alert' && (
        <Card>
          <Card.Header className="bg-info text-light">{graphs.title}</Card.Header>
          <Card.Body>
            <Card.Title>{graphs.msg}</Card.Title>
          </Card.Body>
        </Card>
      )}
    </>
  );
});

const MyChart = (props) => {
  const key = useRef(0); // 차트가 랜더링 될때마다 키를 새로 생성해서 remount 시켜준다.
  key.current++;
  useEffect(() => {
    logger.render('MyChart :', key.current);
  }, [props]);

  key.current++;
  const plugins = [
    {
      beforeDraw: function (chart) {
        const ctx = chart.canvas.getContext('2d');
        ctx.save();
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#F6F6F6';
        ctx.fillRect(0, 0, chart.width, chart.height);
        ctx.restore();
      },
    },
  ];
  return <Chart key={key.current} {...props} plugins={plugins} />;
};

const GraphData = React.memo(({ data, onClickData }) => {
  logger.render('LogGraph - GraphData');
  return (
    <Accordion.Item eventKey={String(data.id)}>
      <Accordion.Header>
        <div className="d-flex justify-content-between left-title">
          {data.title}
          <Badge bg="secondary" pill>
            {data.items.length}
          </Badge>
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <ListGroup variant="flush">
          {data.items.map((item) => (
            <ListGroup.Item key={item.id} className="text-success" name={item.name} onClick={() => onClickData(item)}>
              <small>{item.comment}</small>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Accordion.Body>
    </Accordion.Item>
  );
});

const DateSelectModal = forwardRef(({ onConfirm }, ref) => {
  logger.render('LogGraph - DateSelectModal');
  const [state, setState] = useState({ show: false });

  useImperativeHandle(ref, () => ({
    show: (data) => {
      setState({
        show: true,
        comment: data.comment,
        date_type: data.date_type,
        start_dt: com.now(-data.start_prev_day),
        end_dt: com.now(),
        name: data.name,
      });
    },
  }));

  const onClose = () => {
    setState({ show: false });
  };
  const onSubmit = (e) => {
    e.preventDefault();

    onConfirm(moment(state.start_dt).format('YYYY-MM-DD'), moment(state.end_dt).format('YYYY-MM-DD'), state.name);
    onClose();
  };

  return (
    <Modal show={state.show} onHide={onClose} backdrop="static">
      {state.comment && (
        <div>
          <Modal.Header className="d-flex justify-content-center">
            <Modal.Title className="text-primary">{state.comment}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={onSubmit} id="date-modal-form">
              {(state.date_type === 'all' || state.date_type === 'start') && (
                <div>
                  <Form.Label>시작 날짜</Form.Label>
                  <DateInput
                    selectDate={state.start_dt}
                    maxDate={state.end_dt}
                    placeholder="시작날짜"
                    onChange={(date) => setState({ ...state, start_dt: date })}
                  />
                </div>
              )}
              {state.date_type === 'all' && (
                <div>
                  <Form.Label>끝 날짜</Form.Label>
                  <DateInput
                    selectDate={state.end_dt}
                    minDate={state.start_dt}
                    placeholder="끝날짜"
                    onChange={(date) => setState({ ...state, end_dt: date })}
                  />
                </div>
              )}
            </Form>
          </Modal.Body>
          {state.date_type === 'nothing' && (
            <h5 className="d-flex justify-content-center text-success">확인 하시겠습니까?</h5>
          )}
          <Modal.Footer className="d-flex justify-content-center">
            <Button variant="primary" type="submit" form="date-modal-form">
              확인
            </Button>
            <Button variant="secondary" onClick={onClose}>
              취소
            </Button>
          </Modal.Footer>
        </div>
      )}
    </Modal>
  );
});

export default React.memo(LogGraph);
