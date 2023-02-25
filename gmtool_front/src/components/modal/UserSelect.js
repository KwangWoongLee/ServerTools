import React, { useEffect } from 'react';
import { Offcanvas, Table, Button } from 'react-bootstrap';
import Recoils from 'recoils';
import { logger, navigate } from 'util/com';
import request from 'util/request';
import 'styles/Modal.scss';

const UserSelectModal = () => {
  const [state, setState] = Recoils.useState('MODAL:USERSELECT');
  logger.render('UserSelectModal : ', state.show);

  useEffect(() => {}, []);

  const onClose = () => {
    setState({ show: false });
  };

  const onClick = (e) => {
    logger.debug('name = ', e.currentTarget.name);
    request.post(`user/select`, { aidx: e.currentTarget.name }).then((ret) => {
      if (!ret.err) {
        logger.info(ret.data);
        const { idx, name, login_id, region } = ret.data[0];

        Recoils.setState('CONFIG:ACCOUNT', (account) => ({
          ...account,
          user: {
            login_id: login_id,
            nick: name,
            aidx: idx,
            region: region,
          },
        }));
        setState({ show: false });
        navigate('/user/info');
      }
    });
  };

  return (
    <Offcanvas show={state.show} onHide={onClose} placement="top" className="UserSelect">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title className="text-primary">대상유저 선택</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div className="TableBody">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>AIDX</th>
                <th>닉네임</th>
                <th>로그인ID</th>
                <th>UUID</th>
              </tr>
            </thead>
            <tbody>
              {state.user_list &&
                state.user_list.map((d, key) => (
                  <tr key={key}>
                    <td>
                      <Button variant="primary" onClick={onClick} name={d.idx}>
                        선택
                      </Button>
                    </td>
                    <td>{d.idx}</td>
                    <td>{d.name}</td>
                    <td>{d.login_id}</td>
                    <td>{d.uuid}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default React.memo(UserSelectModal);
