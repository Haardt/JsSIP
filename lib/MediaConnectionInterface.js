const Utils = require('./Utils');
const Grammar = require('./Grammar');
const debugerror = require('debug')('JsSIP:ERROR:Socket');

debugerror.log = console.warn.bind(console);

/**
 * Interface documentation: https://jssip.net/documentation/$last_version/api/mediaconnection/
 *
 * Interface definition at MediaConnection.d.ts
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

    // Check Methods.
    try
    {
        [ 'createSdpOffer', 'createSdpAnswer', 'setRemoteSdp', 'setLocalSdp', 'addTrack', 'getRemoteTracks', 'getLocalTracks', 'removeTracks', 'sendDTMF', 'close' ].forEach((method) =>
        {
            if (!Utils.isFunction(mediaConnection[method]))
            {
                debugerror(`missing or invalid JsSIP.MediaConnection method: ${method}`);
                throw new Error(method);
            }
        });
    }
    catch (error)
    {
        return false;
    }

    return true;
};
