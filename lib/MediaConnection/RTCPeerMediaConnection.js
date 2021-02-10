const EventEmitter = require('events').EventEmitter;

module.exports = class RTCPeerMediaConnection extends EventEmitter {

    constructor() {
        super();
        this._type = "BrowserMediaConnection";
    }

    get type() {
        return this._type;
    }

    // Getter
    get signalingState() {
        this.rtcPeerConnection.signalingState;
    }

    setup(pcConfig, rtcConstraints) {
        console.log("***** PC CONFIG: ", pcConfig);
        console.log("***** RTC constraints: ", rtcConstraints);
        this.rtcPeerConnection = new RTCPeerConnection(pcConfig, rtcConstraints);
    }

    receiveSdpOffer(options) {
        return this.rtcPeerConnection.createOffer(options)
            .then(offer => {
                this.setLocalSdp(offer)
                return offer;
            });
    }

    receiveSdpAnswer(options) {
        return this.rtcPeerConnection.createAnswer(options).then(offer => {
            this.setLocalSdp(offer)
            return offer;
        });
    }

    registerIceUpdates(constraints, type, callback) {
        if (this.iceGatheringState === 'complete' && (!constraints || !constraints.iceRestart)) {
            // Move out
            //this._rtcReady = true;

            const e = {originator: 'local', type: type, sdp: this.getLocalSdp().sdp};
            callback('ready', e)
            return Promise.resolve(e.sdp);
        }
        return new Promise(resolve => {
            let finished = false;
            let iceCandidateListener;
            let iceGatheringStateListener;

            const ready = () => {
                this.rtcPeerConnection.removeEventListener('icecandidate', iceCandidateListener);
                this.rtcPeerConnection.removeEventListener('icegatheringstatechange', iceGatheringStateListener);

                finished = true;

                const e = {originator: 'local', type: type, sdp: this.getLocalSdp().sdp};
                callback('ready', e)
                resolve(e.sdp)
            };

            this.rtcPeerConnection.addEventListener('icecandidate', iceCandidateListener = (event) => {
                const candidate = event.candidate;

                if (candidate) {
                    callback('icecandidate', {candidate, ready})
                } else if (!finished) {
                    ready();
                }
            });

            this.rtcPeerConnection.addEventListener('icegatheringstatechange', iceGatheringStateListener = () => {
                if ((this.iceGatheringState === 'complete') && !finished) {
                    ready();
                }
            });
        })
    }

    prepareStreams(mediaConstraints) {
        return navigator.mediaDevices.getUserMedia(mediaConstraints).then(stream => {
            stream.getTracks().forEach((track) => {
                this.addTrack(track, stream);
            });
            return stream
        })
    }

    onIceConnectionEvent(callback) {
        this.rtcPeerConnection.addEventListener('iceconnectionstatechange', () => {
            callback(this.iceConnectionState)
        });
    }

    // Used by exposed peer-connection (tryit-jssip)
    addEventListener(onEvent, callback) {
        this.rtcPeerConnection.addEventListener(onEvent, callback)
    }

    getSenders() {
        return this.rtcPeerConnection.getSenders();
    }

    close() {
        // TODO: close streams
        this.rtcPeerConnection.close()
    }

    //TODO: can we do more?
    setRemoteDescription(sdp) {
        return this.rtcPeerConnection.setRemoteDescription(sdp);
    }

    //TODO: Only one RtcSession consumer!
    getLocalSdp() {
        return this.rtcPeerConnection.localDescription;
    }

    // TODO: make private
    get iceConnectionState() {
        this.rtcPeerConnection.iceConnectionState;
    }

    // TODO: make private
    get iceGatheringState() {
        return this.rtcPeerConnection.iceGatheringState;
    }

    //TODO: make private
    setLocalSdp(sdp) {
        return this.rtcPeerConnection.setLocalDescription(sdp);
    }

    //TODO: make private
    addTrack(track, stream) {
        this.rtcPeerConnection.addTrack(track, stream);
    }

    // TODO: make private
    removeTracks() {
        this.rtcPeerConnection.removeTracks();
    }

    // TODO: make private
    getLocalStreams() {
        return this.rtcPeerConnection.getLocalStreams();
    }

    // TODO: make private
    getRemoteStreams() {
        return this.rtcPeerConnection.getRemoteStreams();
    }
}
