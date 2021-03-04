require('./include/common');
const JsSIP = require('../');
const pkg = require('../package.json');
const RTCPeerMediaConnection = require("../lib/MediaConnection/RTCPeerMediaConnection");
const {isMediaConnection} = require("../lib-es5/MediaConnection");


module.exports = {

  '#isMediaConnection should return false if not all required functions are implemented' : function(test)
  {
    test.equal(isMediaConnection({}), false);
    test.done();
  },

  '#isMediaConnection should return true if the connection is valid' : function(test)
  {
     test.equal(isMediaConnection(
        {
          createSdpOffer: () => {},
          createSdpAnswer: () => {},
          setRemoteSdp: () => {},
          setLocalSdp: () => {},
          addTrack: () => {},
          removeTracks: () => {},
          getLocalTracks: () => {},
          getRemoteTracks: () => {},
          getLocalSdp: () => {},
          sendDTMF: () => {},
          getDTMFSender: () => {},
          close: () => {}
        }
    ), true);
    test.done();
  },
};
