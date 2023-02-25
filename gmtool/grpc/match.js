//dependencies
const caller = require('grpc-caller');

//path to our proto file
const PROTO_FILE = 'grpc/proto/match.proto';

const match_service = caller('0.0.0.0:5001', PROTO_FILE, 'MatchService');

module.exports = match_service;
