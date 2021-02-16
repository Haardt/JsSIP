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

    // TODO: Remove from connection api
    setup(pcConfig, iceConnectionStateCallback)
    {
        this.rtcPeerConnection = new RTCPeerConnection(pcConfig);
        this.rtcPeerConnection.addEventListener('iceconnectionstatechange', () => {
            iceConnectionStateCallback(this.rtcPeerConnection.iceConnectionState)
        });
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

    // Used by exposed peer-connection (tryit-jssip)
    addEventListener(onEvent, callback)
    {
        this.rtcPeerConnection.addEventListener(onEvent, callback)
    }

    getSenders()
    {
        return this.rtcPeerConnection.getSenders();
    }

    close()
    {
        // TODO: close streams
        this.rtcPeerConnection.close()
    }

    //TODO: can we do more?
    setRemoteDescription(sdp)
    {
        return this.rtcPeerConnection.setRemoteDescription(sdp);
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
