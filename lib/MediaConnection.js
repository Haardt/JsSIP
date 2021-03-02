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
 *  method createSdpOffer(options: any): Promise<RTCSessionDescriptionInit>
 *  method createSdpAnswer(options: any): Promise<RTCSessionDescriptionInit>
 *  method setLocalSdp(sdp: RTCSessionDescriptionInit): Promise<void>
 *  method setRemoteSdp(type: string, sdp: string): Promise<void>
 *  method sendInbandDTMF(tones: number, duration: number, interToneGap: number): void
 *  method addTrack(track: MediaStreamTrack, stream: MediaStream): void
 *  method removeTracks(): void
 *  method  close(): void;
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

    // Check Methods.
    try
    {
        [ 'createSdpOffer', 'createSdpAnswer', 'setLocalSdp', 'setRemoteSdp','addTrack', 'removeTracks', 'sendInbandDTMF', 'close' ].forEach((method) =>
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
