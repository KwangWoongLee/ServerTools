import React, { useEffect, useState, useRef } from 'react';

import Head from 'components/template/Head';
import Footer from 'components/template/Footer';
import Body from 'components/template/Body';
import { logger, modal } from 'util/com';
import NewWindow from 'react-new-window';

const Home = () => {
  const [state, setState] = useState({ show: false, url: '' });
  logger.render('Home : ', state);
  const child = useRef(null);

  useEffect(() => {
    // const email = com.storage.getItem('email');
    // const password = com.storage.getItem('password');
    // const account = Recoils.getState('CONFIG:ACCOUNT');
    // if (email && password && account.grade === -1) {
    //   modal.login();
    // }
    window.addEventListener('message', eventHandler);
    return () => window.removeEventListener('message', eventHandler);
  }, []);

  const eventHandler = (event) => {
    if (typeof event.data === 'object') {
      if (event.data.user_no) {
        logger.info(`origin : ${event.origin}, data : ${event.data}`);

        modal.alert('success', '로그인 정보 받음', JSON.stringify(event.data, null, 2));

        setState((s) => ({ ...s, show: false }));
      }
    }
  };

  const onClick = () => {
    const url = 'http://live.fm001.net/v1/auth/aftvlogin?state=weblogin';
    setState({ show: true, url });
  };

  const onUnload = () => {
    if (state.show) setState({ ...state, show: false });
    logger.debug('onUnload');
  };

  const onOpen = () => {
    logger.debug('onOpen');
  };

  return (
    <>
      <Head />
      <Body title={`포트폴리오 ! gmtool ver ${process.env.REACT_APP_VERSION}`}>
        <p>
          <strong className="text-success">이광웅의 </strong> 포트폴리오 입니다.
        </p>
        {process.env.NODE_ENV === 'development' && (
          <div>
            <button onClick={onClick}>LOGIN TEST</button>
          </div>
        )}
        {state.show && (
          <NewWindow url={state.url} center="parent" closeOnUnmount onUnload={onUnload} onOpen={onOpen} ref={child} />
        )}
      </Body>
      <Footer />
    </>
  );
};

for (const name in process.env) {
  logger.info(`${name} = ${process.env[name]}`);
}

export default React.memo(Home);
