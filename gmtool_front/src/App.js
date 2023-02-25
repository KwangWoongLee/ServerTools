import React, { useEffect } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootswatch/dist/slate/bootstrap.min.css';
// cerulean, cosmo, cyborg, darkly, flatly, journal, litera, lumen, lux, materia, minty, morph, pulse, quartz, sandstone, simplex,
// sketchy, slate, solar, spacelab, superhero, united, vapor, yeti, zephyr

import 'react-datepicker/dist/react-datepicker.css';
import { RecoilRoot } from 'recoil';
import RecoilNexus from 'recoil-nexus';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Modals from 'components/modal';

import com, { logger, modal } from 'util/com';

import Home from 'components/Home';
// user
import UserList from 'components/user/UserList';
import UserInfo from 'components/user/UserInfo';
import UserMoney from 'components/user/UserMoney';
// log
import LogDB from 'components/log/LogDB';
import LogGraph from 'components/log/LogGraph';
// manager
import MgrVersion from 'components/manager/MgrVersion';
import MgrServerStatus from 'components/manager/MgrServerStatus';
import MgrAccount from 'components/manager/MgrAccount';
import MgrIgnoreUser from 'components/manager/MgrIgnoreUser';
import MgrSchedule from 'components/manager/MgrSchedule';
// game
import RoomList from 'components/room/RoomList';
import RoomInfo from 'components/room/RoomInfo';

import NavigateCtr from 'components/common/NavigateCtr';

//const Router = process.env.REACT_APP_SSR === '1' ? BrowserRouter : HashRouter;

export function App() {
  logger.render('App');
  useEffect(() => {
    const email = com.storage.getItem('email');
    const password = com.storage.getItem('password');
    if (email && password) {
      modal.login();
    }
    logger.debug('mount App');
  }, []);
  return (
    <RecoilRoot>
      <BrowserRouter>
        <RecoilNexus />
        <NavigateCtr />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="user">
            <Route path="info" element={<UserInfo />} />
            <Route path="list" element={<UserList />} />
            <Route path="money" element={<UserMoney />} />
          </Route>
          <Route path="log">
            <Route path="db" element={<LogDB />} />
            <Route path="graph" element={<LogGraph />} />
          </Route>
          <Route path="manager">
            <Route path="version" element={<MgrVersion />} />
            <Route path="server_status" element={<MgrServerStatus />} />
            <Route path="account" element={<MgrAccount />} />
            <Route path="ignore_user" element={<MgrIgnoreUser />} />
            <Route path="schedule" element={<MgrSchedule />} />
          </Route>
          <Route path="room">
            <Route path="list" element={<RoomList />} />
            <Route path="info" element={<RoomInfo />} />
          </Route>
          <Route path="*" element={<h1>Not Found Page</h1>} />
          <Route path="empty" element={null} />
        </Routes>
        <Modals />
      </BrowserRouter>
    </RecoilRoot>
  );
}

export default App;
