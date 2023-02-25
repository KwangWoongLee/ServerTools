import React from 'react';
import { Button } from 'react-bootstrap';

import _ from 'lodash';

import 'styles/TableData.scss';

const Header = ({ title }) => (
  <>
    <tr className="TableData">
      <td colSpan="6" className="title text-primary">
        {title}
      </td>
    </tr>
    <tr>
      <th>패킷명</th>
      <th>패킷번호</th>
      <th>서버</th>
      <th>설명</th>
      <th>수정 날짜</th>
      <th>수정 내역</th>
    </tr>
  </>
);

const TableData = ({ data, onClick }) => {
  console.log('render TableDat');

  return (
    <>
      {_.map(data, (d, idx) => {
        if (d.title) return <Header key={idx} title={d.title} />;
        else
          return (
            <tr key={idx} className="TableData">
              <td>
                <Button variant="link" onClick={onClick} value={d.name}>
                  {d.name}
                </Button>
              </td>
              <td>{d.cmd}</td>
              <td className={d.server === 1 ? 'text-info' : 'text-warning'}>{d.server === 1 ? '게임' : '매치'}</td>
              <td>{d.comment}</td>
              <td>{d.updatedt}</td>
              <td>{d.updatemsg}</td>
            </tr>
          );
      })}
    </>
  );
};

export default TableData;
