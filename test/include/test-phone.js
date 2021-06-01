const http = require('http')
const WebSocket = require('ws');
const NodeWebSocket = require('jssip-node-websocket');
const JsSIP = require('../../');

module.exports = class TestPhone {
    webSocketSipServerMock() {
        const server = http.createServer({});
        const wss = new WebSocket.Server({ server });
        let test1PhoneWss = null;
        let test2PhoneWss = null;

        wss.on('connection', function connection(ws) {
            ws.on('message', function incoming(message) {
                // console.log('received:', message);
                const fromReg = /[^]From: <sip:(.*)@.*/;
                const from = message.match(fromReg)[1];

                if (message.startsWith("REGISTER ")) {
                    if (from === 'test1') {
                        test1PhoneWss = ws;
                    } else if (from === 'test2') {
                        test2PhoneWss = ws;
                    }

                    const callIdReg = /[^]Call-ID: (.*)/;
                    const callId = message.match(callIdReg)[1];
                    const viaReg = /[^]Via: (.*)/;
                    const via = message.match(viaReg)[1];
                    const contactReg = /[^]Contact: (.*)/;
                    const contact = message.match(contactReg)[1];
                    const fromTagReg = /[^]From: .*tag=(.*)/;
                    const fromTag = message.match(fromTagReg)[1];
                    const toTagReg = /[^]From: .*tag=(.*)/;
                    const toTag = message.match(toTagReg)[1];
                    const ok = "SIP/2.0 200 OK\r\n" +
                        `Via: ${via}\r\n` +
                        `To: <sip:test1@localhost>\r\n` +
                        `From: <sip:test1@localhost>;tag=${fromTag}\r\n` +
                        `Call-ID: ${callId}\r\n` +
                        "CSeq: 1 REGISTER\r\n" +
                        `Contact: ${contact}\r\n` +
                        "Expires: 7200\r\n" +
                        "Content-Length: 0\r\n\r\n";
                    // console.log("Send OK:", ok)
                    ws.send(ok);
                } else if (test1PhoneWss === ws) {
                    test2PhoneWss.send(message)
                } else if (test2PhoneWss === ws) {
                    test1PhoneWss.send(message)
                }
            });

            ws.send('something');
        });
        server.listen(5090);
        return server;
    }

    registerTestPhone(sipResource) {
        return new Promise(resolve => {
            const socket = new NodeWebSocket('ws://localhost:5090', {
                requestOptions: {
                    agent: new http.Agent({rejectUnauthorized: false})
                }
            })

            const configuration = {
                sockets: [socket],
                uri: `sip:${sipResource}@localhost`,
                password: 'test'
            }

            // JsSIP.debug.enable('JsSIP:*');
            const coolPhone = new JsSIP.UA(configuration)

            coolPhone.on('registered', e => {
                resolve(coolPhone)
            })

            coolPhone.on('registrationFailed', e => {
                console.log('registrationFailed', e)
            })

            coolPhone.start()
        })
    }

    call(phone, number, mediaConnection) {
        return new Promise(resolve => {
            const callOptions = {
                eventHandlers: {
                    progress: e => {
                        resolve(mediaConnection.answer)
                    },
                    failed: e => {
                        console.log('call failed with cause: ', e)
                    },
                    ended: e => {
                        console.log('call ended with cause: ')
                    },
                    accepted: e => {
                    }
                }
            }
            phone.call(`sip:${number}@localhost`, mediaConnection, callOptions)
        })
    }
}
