import React, { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { logger } from 'util/com';
import { Link } from 'react-router-dom';
import Recoils from 'recoils';

import 'styles/Template.scss';

const Footer = () => {
  logger.render('Template Footer');
  useEffect(() => {}, []);

  const Mode = Recoils.useValue('MODE');

  return (
    <>
      <Alert variant="primary" className="Footer">
        <Link to="/">
          <h2>
            <strong>포트폴리오</strong> {Mode.mode} GMTOOL VER {process.env.REACT_APP_VERSION}
          </h2>
        </Link>
      </Alert>
    </>
  );
};

export default React.memo(Footer);
