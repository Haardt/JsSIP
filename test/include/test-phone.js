const https = require('https')
const WebSocket = require('ws');
const NodeWebSocket = require('jssip-node-websocket');
const JsSIP = require('../../');

module.exports = class TestPhone {
    webSocketSipServerMock() {
        const server = https.createServer({
            cert: "-----BEGIN CERTIFICATE-----\n" +
                "MIID/TCCAmWgAwIBAgIQZk8vbyNj1OAFvX/rlhX6bzANBgkqhkiG9w0BAQsFADBX\n" +
                "MR4wHAYDVQQKExVta2NlcnQgZGV2ZWxvcG1lbnQgQ0ExFjAUBgNVBAsMDWhlbGRA\n" +
                "aGVsZC1hbWQxHTAbBgNVBAMMFG1rY2VydCBoZWxkQGhlbGQtYW1kMB4XDTIxMDIy\n" +
                "MzE1NTIxMloXDTIzMDUyMzE0NTIxMlowQTEnMCUGA1UEChMebWtjZXJ0IGRldmVs\n" +
                "b3BtZW50IGNlcnRpZmljYXRlMRYwFAYDVQQLDA1oZWxkQGhlbGQtYW1kMIIBIjAN\n" +
                "BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq5PHEEClxHQsTmrKlilRcv6n/BwI\n" +
                "/8mVRvLxFBuZKW99w9fcm2w6Nr84521FseoHz/M5vruhzoYnWACc6axhvhASsism\n" +
                "vocPlHN4NVl7xBoZ7Vvl74+qaWllF57MC3rh99nN9Sg3pUHw5Cg7CHiAhhWRKkoS\n" +
                "UpIQUX+zzEwq0rMplkTAVrz9EeHVPpcEnZK7Sl0osfg2terQbLzWOCI00mD9QgOD\n" +
                "e1xiavqiz24smsCwI+e+xaAIq3QSkrE9VQKUf04bMVIDe8XetSeGmxR6YciJ4gS6\n" +
                "bBvwMYQP5Yd2SK5qA+heeh5qiGsaXlSLB6zvi3aKMttAKLbwOQVIypATOQIDAQAB\n" +
                "o1swWTAOBgNVHQ8BAf8EBAMCBaAwEwYDVR0lBAwwCgYIKwYBBQUHAwEwHwYDVR0j\n" +
                "BBgwFoAUq61SQVYEn6u2mJonyw699CLZw90wEQYDVR0RBAowCIIGd2VicnRjMA0G\n" +
                "CSqGSIb3DQEBCwUAA4IBgQAVnuTQzVLcgpLdBeKw+P8oY3nNyO0E8L1SCeop+VmK\n" +
                "BGJkvNFm1JS//9/GNEo5v7TohzzPzyWOgj3jRs/gHXyuR+OaHp2FflF1GPCZCdHw\n" +
                "sXlWY7ynZEsQf86p6qmIoOhaTXcAdd8saqOWTMKasEDFOJkjsi3h+u21GDolb9kB\n" +
                "/NK8ZQj14kujgtNHoJHih6pjOY0eHAfwowrB7Bu7wDEPifcylcDGwXj8ytcVrCoe\n" +
                "bKmXt5FDPAJtEUrsGIxAh2BhXw4vYbM8i/WuwQp2M/39mf94mRywovo6lwiduiBa\n" +
                "VcMaaHPABKrMfr5N6ctkBPd4WpCP+qttkwzHzARkoC0U2O29fZJIrm+LG6fl4ImS\n" +
                "EU1ShozRRx3ESiCSp1jTiluk/8QHPOkRlUjpsaotnvVF+vtdoq2rIRaSTogHHLI1\n" +
                "MbEXS0W/g/ipkKLvIO4pSLiIhYUMowc/d+N7snF/qS1QKDQTaAKCojmmM52PWYxx\n" +
                "/XMEZ10tZceNfdmNiUjm7kI=\n" +
                "-----END CERTIFICATE-----\n",
            key: "-----BEGIN PRIVATE KEY-----\n" +
                "MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrk8cQQKXEdCxO\n" +
                "asqWKVFy/qf8HAj/yZVG8vEUG5kpb33D19ybbDo2vzjnbUWx6gfP8zm+u6HOhidY\n" +
                "AJzprGG+EBKyKya+hw+Uc3g1WXvEGhntW+Xvj6ppaWUXnswLeuH32c31KDelQfDk\n" +
                "KDsIeICGFZEqShJSkhBRf7PMTCrSsymWRMBWvP0R4dU+lwSdkrtKXSix+Da16tBs\n" +
                "vNY4IjTSYP1CA4N7XGJq+qLPbiyawLAj577FoAirdBKSsT1VApR/ThsxUgN7xd61\n" +
                "J4abFHphyIniBLpsG/AxhA/lh3ZIrmoD6F56HmqIaxpeVIsHrO+Ldooy20AotvA5\n" +
                "BUjKkBM5AgMBAAECggEBAICGHiNqicHzVA0Zqc95++0sHSGYzpTsp8mRykzJr51+\n" +
                "SrMdS7+Q/rpr23BgRkjTii6Xf7YET1yo2WfubZwM6Nq6p4aXFFq8SUtmg7FS6ocn\n" +
                "FizbHg6pi3mS3YsoBKjEz+gdW049ZhGAp7YA/NeHjJ7kIO2QttDrYRXrlv9+PsW8\n" +
                "/XJsvqtgU+yMhZUCzz/DizClw76nHPDtNy+BzcdzqeWGBq3u0p4HnmdxT1LUQrU9\n" +
                "0TltsYMW7y6q1dXeQpVXTY+gau8WMWaJ+SbJ2Rb4ZeHmdl0fHW/yr/EmY1tqE2nk\n" +
                "Mscp9nUYqMSYG2sZBSs1I67br4jhaF9joyKl6uTDRgECgYEAztIdn6/FuHgxpsBg\n" +
                "aPo49hvWegnRY8GLoMaUOkqLKBjgJ29fLeVBv/yu6sey0fW58sRPdydpEthWYJyO\n" +
                "lg424gPsnwaU6oJjwz+oFX8fLT4Hq2WYgVctaNnC5xiIFuJiUbdCneK2w82VWUZ8\n" +
                "tkdyDttwU90qQN+Riw2iGjUOdYkCgYEA1GBE/dvufXT0G4uU7hmwXE1/Fm1bTpBH\n" +
                "stOFdzsdWjrOreDhcp4KIgdr87+Krrf2n7dVJAy45hFjzIgq0+VFX017K3IsldTC\n" +
                "KeOoiMeY9HpQyxxBiFRHffUJ3tjRJ9pQ3jtaBsPsEvWm98n+60b3PQeNEp8cBGRY\n" +
                "jHSd/uhd9DECgYB9UPc+MOUe90UugtZoBWXKSefVHmnPhhCypGBgSZaz/w6jFmqX\n" +
                "hpgmWlcqT0Jc0gWPwb9ctXaHQqpj87i513cNz87qNLS6u7LzNXkFPXeIlFNVWUPk\n" +
                "6wvKwlfEayraouVsGhy1Sg/v6HucEoeycuv7cJ9JUXMux8iKdwJH2uod8QKBgGtd\n" +
                "sANW6J7sPWyfiE9HFW3Uj+daqcpyDo1Nei/o5tHy4QHuqoszcpP5hI3Zy9bAkiH0\n" +
                "oUp0VBWbvQRt4pj1U7j2hspUEk49HVvoCA/+OEmAfM/yHP86/FmlQ7QxkKvBJxjy\n" +
                "kHTTH8oF/r9Ok12Gpv9njd5YKeXehRWc7zMrbjRBAoGBAIP9z+POmNRZi55SsitT\n" +
                "nk/EO6iibtONvlDzWcYx3XdXNndKASdXvtlNTGPcI3v/tdPIxm8jMmMsTo0AvbIr\n" +
                "wYxZc+DvWOAdl7pFocOodKbzguNBvvpm5G4ihzcwDd8ZtNDj/sRPYENrhH35PSxz\n" +
                "68qjjXKAyCwiPMt8MZpNjaVH\n" +
                "-----END PRIVATE KEY-----\n"
        });
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
            const socket = new NodeWebSocket('wss://localhost:5090', {
                requestOptions: {
                    agent: new https.Agent({rejectUnauthorized: false})
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
