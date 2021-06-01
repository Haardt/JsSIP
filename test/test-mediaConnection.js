const TestPhone = require("./include/test-phone");
const TestMediaConnection = require("./include/testMediaConnection");

require('./include/common');
const JsSIP = require('../');
const pkg = require('../package.json');
const MediaConnection = require("../lib/MediaConnection/MediaConnection");
const {isMediaConnection} = require("../lib/MediaConnectionInterface");


module.exports = {

    '#isMediaConnection should return false if not all required functions are implemented': function (test)
    {
        test.equal(isMediaConnection({}), false);
        test.done();
    },

    '#isMediaConnection should return true if the connection is valid': function (test)
    {
        test.equal(isMediaConnection(new MediaConnection({}, () => {
            },
            // Mocked RTCPeerConnection
            {
                addEventListener: () => {
                }
            })), true);
        test.done();
    },

    'A phone call should use the offer and answer functions from the mediaconnection': async function (test)
    {
        const testPhone = new TestPhone()
        const server = testPhone.webSocketSipServerMock()
        const mediaConnection = new TestMediaConnection()
        const phone1 = await testPhone.registerTestPhone("test1", mediaConnection)
        const phone2 = await testPhone.registerTestPhone("test2", mediaConnection)

        let offer = '';
        let answer = '';

        await new Promise(async resolve => {
            phone2.on('newRTCSession', function (e) {
                e.session.on('sdp', (sdp) => {
                    if (sdp.type === 'offer')
                    {
                        offer = sdp.sdp;
                    }
                    if (sdp.type === 'answer')
                    {
                        answer = sdp.sdp;
                    }
                })
                e.session.answer(mediaConnection);
                setTimeout(() => resolve(), 1000);
            });
            await testPhone.call(phone1, "test2", mediaConnection)
        })

        phone1.stop()
        phone2.stop()
        server.close()

        test.equal(offer, 'Test offer sdp')
        test.equal(answer, 'Test answer sdp')

        test.done();
    },
};
