const socketio = require('socket.io');
const redis = require('db/redis');
const conf = require('util/conf');
const com = require('util/com');
const ginfo = require('util/ginfo');

let io;

function send_data(cmd, data, err) {
  if (!data) data = {};
  const send = {
    cmd: cmd,
    status: err ? err : ginfo.msg_error_type.none,
    data: data,
  };

  if (err) console.warn('res packet : ', cmd, ' error - ', err, ' : msg = ', ginfo.msg_error_type.none);
  else console.debug('res packet : ', cmd, ' -', send);

  return send;
}

exports.init = async function (server) {
  io = socketio(server, {
    pingInterval: 25000,
    pingTimeout: 5000,
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  if (conf.sio_redis_connect) {
    const adapter = await redis.get_sio_redis_adapter(conf.redis.socket_io.host, conf.redis.socket_io.port, conf.redis.socket_io.key);
    io.adapter(adapter);
  }
};

exports.send_chat = function (send_type, data) {
  const send_data = {
    chat_type: data.chat_type,
    msg: data.msg,
    sender_aidx: 1,
    sender_name: 'freemeta',
  };

  switch (send_type) {
    case 'all':
      send_all(ginfo.game_msg_type.chat, send_data);
      break;
    case 'world':
      send_world(data.world_key, ginfo.game_msg_type.chat, send_data);
      break;
    case 'channel':
      send_channel(data.channel_key, ginfo.game_msg_type.chat, send_data);
      break;
    case 'target':
      send_target(data.aidx, ginfo.game_msg_type.chat, send_data);
      break;
  }
};

exports.send_message = function (data) {
  send_target(data.target_aidx, ginfo.game_msg_type.message, data);
};

// all user
send_all = function (cmd, data) {
  io.emit('response', send_data(cmd, data));
};

// world all
send_world = function (world_key, cmd, data) {
  if (typeof world_key !== 'string') world_key = String(world_key);
  io.to(world_key).emit('response', send_data(cmd, data));
  console.log('send_world ' + world_key);
};

// channel all
send_channel = function (channel_key, cmd, data) {
  if (typeof channel_key !== 'string') channel_key = String(channel_key);
  io.to(channel_key).emit('response', send_data(cmd, data));
  console.log('send_channel ' + channel_key);
};

// target , aidx
send_target = function (aidx, cmd, data) {
  io.to(com.get_private_room_name(aidx)).emit('response', send_data(cmd, data));
};
