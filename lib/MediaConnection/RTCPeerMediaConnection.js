const EventEmitter = require('events').EventEmitter;

module.exports = class RTCPeerMediaConnection extends EventEmitter {
    get LOCAL_DESCRIPTION_INDEX() { return 2 };

    constructor(pcConfig, iceConnectionStateCallback)
    {
        super();

        this.rtcPeerConnection = new RTCPeerConnection(pcConfig);
        this.rtcPeerConnection.addEventListener('iceconnectionstatechange', () => {
            iceConnectionStateCallback(this.rtcPeerConnection.iceConnectionState)
        });
    }


    createSdpOffer(options) {
        return this.rtcPeerConnection.createOffer(options).then(offer =>
            Promise.all([
                this.setLocalSdp(offer),
                this._waitForIceReadiness(options),
                Promise.resolve(this.getLocalSdp())])
        ).then( result => result[this.LOCAL_DESCRIPTION_INDEX])
    }

    createSdpAnswer(options) {
        return this.rtcPeerConnection.createAnswer(options).then(answer =>
            Promise.all([
                this.setLocalSdp(answer),
                this._waitForIceReadiness(options),
                Promise.resolve(this.getLocalSdp())]))
            .then(result => result[this.LOCAL_DESCRIPTION_INDEX])
    }

    setRemoteSdp(type, sdp)
    {
        const description = new RTCSessionDescription({ type: type, sdp: sdp });

        return this.rtcPeerConnection.setRemoteDescription(description);
    }

    setLocalSdp(sdp)
    {
        return this.rtcPeerConnection.setLocalDescription(sdp);
    }

    getLocalSdp()
    {
        return this.rtcPeerConnection.localDescription;
    }

    addTrack(track, stream) {
        this.rtcPeerConnection.addTrack(track, stream);
    }

    getLocalTracks()
    {
        return this.rtcPeerConnection.getSenders().map(sender => sender.track);
    }

    getRemoteTracks()
    {
        return this.rtcPeerConnection.getReceivers().map(receiver => receiver.track);
    }

    sendDTMF(tones, duration, interToneGap)
    {
        const getDTMFSender = () =>
        {
            const sender = this.rtcPeerConnection.getSenders().find((rtpSender) =>
            {
                return rtpSender.track && rtpSender.track.kind === 'audio';
            });

            if (!(sender && sender.dtmf))
            {
                return;
            }

            return sender.dtmf;
        }

        getDTMFSender().insertDTMF(tones, duration, interToneGap)
    }

    close()
    {
        this.rtcPeerConnection.close()
    }

    /**
     * RtcPeer specific methods for the opinionated default implementation
     */

    _waitForIceReadiness(constraints)
    {
        if (this._iceGatheringState === 'complete' && (!constraints || !constraints.iceRestart))
        {
            return Promise.resolve();
        }

        return new Promise(resolve =>
        {
            let finished = false;
            let iceCandidateListener;
            let iceGatheringStateListener;

            const ready = () =>
            {
                this.rtcPeerConnection.removeEventListener('icecandidate', iceCandidateListener);
                this.rtcPeerConnection.removeEventListener('icegatheringstatechange', iceGatheringStateListener);
                finished = true;
                resolve()
            };

            this.rtcPeerConnection.addEventListener('icecandidate', iceCandidateListener = (event) =>
            {
                const candidate = event.candidate;

                if (candidate)
                {
                    this.emit('icecandidate',
                        {
                            candidate: event.candidate,
                            ready: ready
                        });
                } else if (!finished)
                {
                    ready();
                }
            });

            this.rtcPeerConnection.addEventListener('icegatheringstatechange', iceGatheringStateListener = () =>
            {
                if ((this._iceGatheringState === 'complete') && !finished) {
                    ready();
                }
            });
        })
    }

    removeTracks()
    {
        this.rtcPeerConnection.removeTracks();
    }

    // Used by exposed peer-connection (tryit-jssip)
    addEventListener(onEvent, callback)
    {
        this.rtcPeerConnection.addEventListener(onEvent, callback)
    }

    // TODO: make private
    get _iceGatheringState()
    {
        return this.rtcPeerConnection.iceGatheringState;
    }
}
