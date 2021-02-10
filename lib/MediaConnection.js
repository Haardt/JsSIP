const Utils = require('./Utils');
const Grammar = require('./Grammar');
const debugerror = require('debug')('JsSIP:ERROR:Socket');

debugerror.log = console.warn.bind(console);

/**
 * Interface documentation: https://jssip.net/documentation/$last_version/api/mediaconnection/
 *
 * interface MediaConnection {
 *  attribute String example
 *
 *  method receiveSdpOffer(sdp);
 *  method receiveSdpAnswer(sdp);
 *  method getLocalSdp();
 *  method addTracks([tracks]);
 *  method removeTracks([tracks]);
 *
 *  attribute EventHandler onNewTrack
 *  attribute EventHandler onIceCandidate
 *  attribute EventHandler onClose
 *  attribute EventHandler icegatheringstatechange
 *
 * }
 *
 */

exports.isMediaConnection = (mediaConnection) =>
{
    // Ignore if an array is given.
    if (Array.isArray(mediaConnection))
    {
        return false;
    }

    if (typeof mediaConnection === 'undefined')
    {
        debugerror('undefined JsSIP.MediaConnection instance');

        return false;
    }

    // Check Properties.
    try
    {
        // if (!Utils.isString(socket.url))
        // {
        //   debugerror('missing or invalid JsSIP.Socket url property');
        //   throw new Error();
        // }
    }
    catch (e)
    {
        return false;
    }

    // Check Methods.
    try
    {
        [ 'receiveSdpOffer', 'receiveSdpAnswer', 'setLocalSdp', 'getLocalSdp', 'addTrack', 'removeTracks' ].forEach((method) =>
        {
            if (!Utils.isFunction(mediaConnection[method]))
            {
                debugerror(`missing or invalid JsSIP.MediaConnector method: ${method}`);
                console.log(`missing or invalid JsSIP.MediaConnector method: ${method}`);
                throw new Error();
            }
        });
    }
    catch (e)
    {
        return false;
    }

    return true;
};
