import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { modal, logger } from 'util/com';
import { Card } from 'react-bootstrap';

import 'styles/Template.scss';
const Timer = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    logger.debug('mount Timer');
    const timer_handle = setInterval(() => {
      setTime(() => moment().format('YYYY-MM-DD HH:mm:ss'));
    }, 500);

    return () => clearInterval(timer_handle);
  }, []);

  const onClick = () => {
    modal.alert('success', '', time);
  };

  return <div onClick={onClick}>{time}</div>;
};

const Body = ({ title, children }) => {
  logger.render('Template Body');
  useEffect(() => {}, []);

  return (
    <>
      <Card className="Body border-secondary">
        <Card.Header className="border-secondary">
          <div className="d-flex justify-content-between text-primary">
            <div>{title}</div>
            <Timer />
          </div>
        </Card.Header>
        <Card.Body>{children}</Card.Body>
      </Card>
    </>
  );
};

export default React.memo(Body);
