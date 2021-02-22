const EventEmitter = require('events').EventEmitter;

module.exports = class RTCPeerMediaConnection extends EventEmitter {

    constructor()
    {
        super();
        this._type = "BrowserMediaConnection";
    }

    get type()
    {
        return this._type;
    }

    receiveSdpOffer(options) {
        return this.rtcPeerConnection.signalingState === 'stable' ? this.rtcPeerConnection.createOffer(options)
            .then(offer => {
                return Promise.all(
                    [Promise.resolve(offer), this.setLocalSdp(offer)]);
            }) : Promise.resolve([{sdp: null, type: null}, null]);
    }

    receiveSdpAnswer(options) {
        return this.rtcPeerConnection.createAnswer(options).then(offer => {
            this.setLocalSdp(offer)
            return offer;
        });
    }

    setRemoteSdp(type, sdp)
    {
        const description = new RTCSessionDescription({ type: type, sdp: sdp });
        return this.rtcPeerConnection.setRemoteDescription(description);
    }

    addTrack(track, stream) {
        this.rtcPeerConnection.addTrack(track, stream);
    }

    getLocalSdp(constraints, type)
    {
        if (this.iceGatheringState === 'complete' && (!constraints || !constraints.iceRestart))
        {
            const e = {originator: 'local', type: type, sdp: this.getLocalSdp().sdp};
            return Promise.resolve(e);
        }

        return new Promise(resolve => {
            let finished = false;
            let iceCandidateListener;
            let iceGatheringStateListener;

            const ready = () =>
            {
                this.rtcPeerConnection.removeEventListener('icecandidate', iceCandidateListener);
                this.rtcPeerConnection.removeEventListener('icegatheringstatechange', iceGatheringStateListener);

                finished = true;

                const e = {originator: 'local', type: type, sdp: this._getLocalSdp().sdp};
                resolve(e)
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
                if ((this.iceGatheringState === 'complete') && !finished) {
                    ready();
                }
            });
        })
    }

    sendInbandDTMF(tones, duration, interToneGap)
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
        // TODO: close streams
        this.rtcPeerConnection.close()
    }

    /**
     * RtcPeer specific methods for the opinionated default implementation
     */

    // Used by exposed peer-connection (tryit-jssip)
    addEventListener(onEvent, callback)
    {
        this.rtcPeerConnection.addEventListener(onEvent, callback)
    }

    // TODO: remove from api
    getSenders()
    {
        return this.rtcPeerConnection.getSenders();
    }



    // TODO: Remove from connection api
    setup(pcConfig, iceConnectionStateCallback)
    {
        this.rtcPeerConnection = new RTCPeerConnection(pcConfig);
        this.rtcPeerConnection.addEventListener('iceconnectionstatechange', () => {
            iceConnectionStateCallback(this.rtcPeerConnection.iceConnectionState)
        });
    }

    //TODO: remove / make private
    _getLocalSdp()
    {
        return this.rtcPeerConnection.localDescription;
    }

    // TODO: make private
    get iceGatheringState()
    {
        return this.rtcPeerConnection.iceGatheringState;
    }

    //TODO: make private
    setLocalSdp(sdp)
    {
        return this.rtcPeerConnection.setLocalDescription(sdp);
    }

    // TODO: make private
    removeTracks()
    {
        this.rtcPeerConnection.removeTracks();
    }

    // TODO: make private
    getLocalStreams()
    {
        return this.rtcPeerConnection.getLocalStreams();
    }

    // TODO: make private
    getRemoteStreams()
    {
        return this.rtcPeerConnection.getRemoteStreams();
    }
}
