import React, { useState } from 'react';
import {
  Container,
  ButtonToolbar,
  ButtonGroup,
  Button,
  Table,
  InputGroup,
  FormControl,
  Row,
  Col,
} from 'react-bootstrap';

import _ from 'lodash';

import { AiFillCaretUp, AiFillCaretDown, AiOutlineMinus } from 'react-icons/ai';

import View, { view_show_ref } from 'components/View';
import TableData from './TableData';
import packet from 'util/packet';

// https://react-icons.github.io/react-icons : icons
// import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';

import 'styles/Home.scss';

const SortIcon = ({ sort_type }) => {
  if (sort_type === 1) return <AiFillCaretUp />;
  else if (sort_type === 2) return <AiFillCaretDown />;
  return <AiOutlineMinus />;
};

const Home = () => {
  console.log('render Home');

  const [data, setData] = useState(packet);
  const [sort, setSort] = useState({ name: 0, cmd: 0, server: 0, updatedt: 0 });
  const [search, setSearch] = useState('');

  const onClick = (e) => {
    const title = e.target.innerText;
    const file_name = e.target.value;

    // 모듈 동적로딩
    import(`../assets/packet/${file_name}.txt`)
      .then((mod) => fetch(mod.default))
      .then((response) => response.text())
      .then((text) => view_show_ref.current(title, text));

    console.log(e.target);
  };

  const onClickSearch = (e) => {
    const sort_name = e.target.value;
    let type = sort[sort_name];
    if (++type > 2) type = 0;

    sort[sort_name] = type;
    setSort(() => sort);

    const clone_packet = _.cloneDeep(packet);
    if (type === 0) setData(clone_packet); // default
    else if (type === 1) {
      // asc
      _.remove(clone_packet, (n) => n.title);
      setData(_.sortBy(clone_packet, sort_name));
    } else if (type === 2) {
      // asc
      _.remove(clone_packet, (n) => n.title);
      setData(_.sortBy(clone_packet, sort_name).reverse());
    }
  };

  const onChange = (e) => {
    const text = e.target.value;
    setSearch(text);

    if (text === '') setData(packet);
    else {
      const data = _.filter(packet, (d) => {
        if (d.title) return false;
        if (d.name.indexOf(text) !== -1) return true;
        if (String(d.cmd).indexOf(text) !== -1) return true;
        if (d.comment.indexOf(text) !== -1) return true;
        if (d.updatedt.indexOf(text) !== -1) return true;
        if (d.updatemsg.indexOf(text) !== -1) return true;

        return false;
      });

      setData(data);
    }
  };

  return (
    <>
      <Container fluid className="Home">
        <div className="d-flex justify-content-center">
          <h2 className="text-primary"> 게임 서버 패킷</h2>
        </div>
        <hr />
        <div className="d-grid gap-2">
          <Button variant="outline-primary" onClick={onClick} value="_code">
            패킷코드 & 에러코드
          </Button>
          <Button variant="outline-primary" onClick={onClick} value="_comon_recv_data">
            패킷공통 Recv Data
          </Button>
        </div>
        <hr />

        <Table bordered hover responsive>
          <thead>
            <tr>
              <th colSpan="6">
                <ButtonToolbar className="mb-3">
                  <Row style={{ width: '100%' }}>
                    <Col sm={6}>
                      <ButtonGroup className="me-2">
                        <Button variant="outline-secondary" onClick={onClickSearch} value="name">
                          패킷명 <SortIcon sort_type={sort.name} />
                        </Button>{' '}
                        <Button variant="outline-secondary" onClick={onClickSearch} value="cmd">
                          패킷번호 <SortIcon sort_type={sort.cmd} />
                        </Button>{' '}
                        <Button variant="outline-secondary" onClick={onClickSearch} value="server">
                          서버 <SortIcon sort_type={sort.server} />
                        </Button>{' '}
                        <Button variant="outline-secondary" onClick={onClickSearch} value="updatedt">
                          수정날짜 <SortIcon sort_type={sort.updatedt} />
                        </Button>
                      </ButtonGroup>
                    </Col>
                    <Col sm={6}>
                      <InputGroup style={{ width: '100%' }}>
                        <InputGroup.Text id="btnGroupAddon">검색</InputGroup.Text>
                        <FormControl
                          type="text"
                          placeholder="검색단어"
                          aria-label="search"
                          aria-describedby="btnGroupAddon"
                          value={search}
                          onChange={onChange}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </ButtonToolbar>
              </th>
            </tr>
          </thead>
          <tbody>
            <TableData data={data} onClick={onClick} />
          </tbody>
        </Table>
      </Container>
      <View />
    </>
  );
};

export default Home;
