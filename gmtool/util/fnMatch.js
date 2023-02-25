'use strict';

const match_service = require('grpc/match');

exports.create_room = async function (req_create_room) {
  return await match_service.CreateRoom(req_create_room);
};

exports.enter_room = async function (req_enter_room) {
  return await match_service.EnterRoom(req_enter_room);
};

exports.leave_room = async function (req_leave_room) {
  return await match_service.LeaveRoom(req_leave_room);
};

exports.room_list = async function (req_room_list) {
  return await match_service.GetRoomList(req_room_list);
};

exports.enter_game = async function (req_enter_game) {
  return await match_service.EnterGame(req_enter_game);
};
