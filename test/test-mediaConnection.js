require('./include/common');
const JsSIP = require('../');
const pkg = require('../package.json');
const {isMediaConnection} = require("../lib/MediaConnection");
const RTCPeerMediaConnection = require("../lib/MediaConnection/RTCPeerMediaConnection");


module.exports = {

  'test faulty MediaConnection' : function(test)
  {
    test.equal(isMediaConnection({}), false);
    test.done();
  },

  'test valid MediaConnection' : function(test)
  {
    test.equal(isMediaConnection(new RTCPeerMediaConnection()), true);
    test.done();
  },
};
