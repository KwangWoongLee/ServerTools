import React, { useEffect } from 'react';
import { Button, Navbar, Nav, NavDropdown, DropdownButton, Form, OverlayTrigger, Popover } from 'react-bootstrap';
import 'styles/Template.scss';
import { logger, page_reload, navigate } from 'util/com';
import {
  onServerReset,
  onUserKick,
  onClickUserSearch,
  onLink,
  onSendChat,
  onClickLogin,
  onClickMgrMail,
  onClickSendMsg,
} from 'util/head_handler';

import { AiOutlineReload, AiTwotoneHome } from 'react-icons/ai';
import { FaLock, FaLockOpen } from 'react-icons/fa';

import Recoils from 'recoils';

const Head = () => {
  logger.render('Template Head');
  const account = Recoils.useValue('CONFIG:ACCOUNT');

  useEffect(() => {}, []);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <div className="Head d-flex justify-content-between">
          <Nav>
            <div className="IcoBtn d-flex align-items-center ms-2 me-2" onClick={() => navigate('/')}>
              <AiTwotoneHome />
            </div>
            <div className="IcoBtn d-flex align-items-center ms-2 me-2" onClick={page_reload}>
              <AiOutlineReload />
            </div>
            <NavDropdown title="유저검색">
              <NavDropdown.Item name="idx" onClick={onClickUserSearch}>
                유저IDX
              </NavDropdown.Item>
              <NavDropdown.Item name="name" onClick={onClickUserSearch}>
                닉네임
              </NavDropdown.Item>
              <NavDropdown.Item name="login_id" onClick={onClickUserSearch}>
                로그인ID
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="선택유저" disabled={account.user.aidx === 0}>
              <NavDropdown.Item onClick={onLink} name="/user/info">
                기본정보
              </NavDropdown.Item>
              <NavDropdown.Item onClick={onLink} name="/user/money">
                재화
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="전체유저">
              <NavDropdown.Item onClick={onLink} name="/user/list">
                전체 유저 보기
              </NavDropdown.Item>
              <NavDropdown.Item onClick={onUserKick}>모든유저 KICK</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="게임">
              <NavDropdown.Item onClick={onLink} name="/room/list">
                방 목록
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <NavDropdown title="로그">
              <NavDropdown.Item onClick={onLink} name="/log/db">
                DB 로그
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLink} name="/log/graph">
                집계 로그
              </NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="관리">
              <NavDropdown.Divider />
              <DropdownButton variant="" drop="start" title="서버관리" className="MgrL">
                <NavDropdown.Item onClick={onLink} name="/manager/version">
                  버전및 접속제어
                </NavDropdown.Item>
                <NavDropdown.Item onClick={onLink} name="/manager/server_status">
                  서버 상태보기
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLink} name="/manager/account">
                  Tool 계정
                </NavDropdown.Item>
                <NavDropdown.Item onClick={onLink} name="/manager/ignore_user">
                  점검무시 IP 관리
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onServerReset}>서버 리셋</NavDropdown.Item>
              </DropdownButton>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={onLink} name="/manager/schedule">
                스케쥴 관리
              </NavDropdown.Item>
            </NavDropdown>

            <div className="ms-3">
              <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={
                  <Popover>
                    <Popover.Header>
                      {account.grade === -1 ? '로그인 되지 않음' : `로그인 등급 - ${account.grade}`}
                    </Popover.Header>
                    <Popover.Body>
                      {account.user.aidx === 0 ? (
                        '선택된 유저 없음'
                      ) : (
                        <div>
                          선택 유저
                          <br />
                          AIDX : {account.user.aidx}
                          <br />
                          닉네임 : {account.user.nick}
                        </div>
                      )}
                    </Popover.Body>
                  </Popover>
                }
              >
                <Form.Control type="text" placeholder="선택유저 없음" value={account.user.nick} disabled />
              </OverlayTrigger>
            </div>

            <Button
              className="ms-3 rounded-circle"
              variant={account.grade === -1 ? 'secondary' : 'success'}
              onClick={onClickLogin}
              name={account.grade}
            >
              {account.grade === -1 ? <FaLock /> : <FaLockOpen />}
            </Button>
          </Nav>
        </div>
      </Navbar>
    </>
  );
};

export default React.memo(Head);
