require('./include/common');
const JsSIP = require('../');
const pkg = require('../package.json');
const MediaConnection = require("../lib/MediaConnection/MediaConnection");
const {isMediaConnection} = require("../lib/MediaConnectionInterface");


module.exports = {

  '#isMediaConnection should return false if not all required functions are implemented' : function(test)
  {
    test.equal(isMediaConnection({}), false);
    test.done();
  },

  '#isMediaConnection should return true if the connection is valid' : function(test)
  {
      test.equal(isMediaConnection(new MediaConnection({}, () => {},
      // Mocked RTCPeerConnection
      {
        addEventListener: () => {}
      })), true);
    test.done();
  },
};
