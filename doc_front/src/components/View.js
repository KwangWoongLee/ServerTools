import React, { useState } from 'react';
import { Modal, Form } from 'react-bootstrap';

import 'styles/View.scss';

export const view_show_ref = React.createRef();

const View = () => {
  const [state, setState] = useState({ show: false, title: '', file: '' });
  console.log('render View : ', state.title);

  const onShow = (title, file) => {
    setState({ show: true, title, file });
  };

  view_show_ref.current = onShow;

  const onClose = () => setState({ ...state, show: false });

  return (
    <div className="View">
      <Modal dialogClassName="modal-90w" backdrop="static" show={state.show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">{state.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control className="bg-dark text-light" as="textarea" rows={30} value={state.file} readOnly />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default View;
