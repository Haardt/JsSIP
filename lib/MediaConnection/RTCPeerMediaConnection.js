const EventEmitter = require('events').EventEmitter;

module.exports = class RTCPeerMediaConnection extends EventEmitter
{
  constructor(pcConfig, iceConnectionStateCallback)
  {
    super();


    this.rtcPeerConnection = new RTCPeerConnection(pcConfig);
    this.rtcPeerConnection.addEventListener('iceconnectionstatechange', () =>
    {
      iceConnectionStateCallback(this.rtcPeerConnection.iceConnectionState);
    });
  }


  createSdpOffer(options)
  {
    return this.rtcPeerConnection.createOffer(options)
      .then((offer) => this.setLocalSdp(offer))
      .then(() => this._waitForIceCandidates(options))
      .then(() => this.getLocalSdp());
  }

  createSdpAnswer(options)
  {
    return this.rtcPeerConnection.createAnswer(options)
      .then((answer) => this.setLocalSdp(answer))
      .then(() => this._waitForIceCandidates(options))
      .then(() => this.getLocalSdp());
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

  addTrack(track, stream)
  {
    this.rtcPeerConnection.addTrack(track, stream);
  }

  getLocalTracks()
  {
    return this.rtcPeerConnection.getSenders().map((sender) => sender.track);
  }

  getRemoteTracks()
  {
    return this.rtcPeerConnection.getReceivers().map((receiver) => receiver.track);
  }

  removeTracks()
  {
    this.rtcPeerConnection.removeTracks();
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
    };

    getDTMFSender().insertDTMF(tones, duration, interToneGap);
  }

  close()
  {
    this.rtcPeerConnection.close();
  }

  addEventListener(onEvent, callback)
  {
    this.rtcPeerConnection.addEventListener(onEvent, callback);
  }

  /**
   * Private Methods.
   */

  _waitForIceCandidates(constraints)
  {
    if (this._iceGatheringState === 'complete' && (!constraints || !constraints.iceRestart))
    {
      return Promise.resolve();
    }

    return new Promise((resolve) =>
    {
      let finished = false;
      let iceCandidateListener;
      let iceGatheringStateListener;

      const ready = () =>
      {
        this.rtcPeerConnection.removeEventListener('icecandidate', iceCandidateListener);
        this.rtcPeerConnection.removeEventListener('icegatheringstatechange', iceGatheringStateListener);
        finished = true;
        resolve();
      };

      this.rtcPeerConnection.addEventListener('icecandidate', iceCandidateListener = (event) =>
      {
        const candidate = event.candidate;

        if (candidate)
        {
          this.emit('icecandidate',
            {
              candidate : event.candidate,
              ready     : ready
            });
        }
        else if (!finished)
        {
          ready();
        }
      });

      this.rtcPeerConnection.addEventListener('icegatheringstatechange', iceGatheringStateListener = () =>
      {
        if ((this._iceGatheringState === 'complete') && !finished)
        {
          ready();
        }
      });
    });
  }

  get _iceGatheringState()
  {
    return this.rtcPeerConnection.iceGatheringState;
  }
};
