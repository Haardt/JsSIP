
module.exports = class TestMediaConnection {
  createSdpOffer(options) {
    return Promise.resolve({
      sdp: "Test offer sdp",
      type: 'offer',
      toJSON: () => {}
    })
  }

  createSdpAnswer(options) {
    return Promise.resolve({
      sdp: "Test answer sdp",
      type: 'answer',

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      toJSON: () => {}
    })
  }

  setRemoteSdp({ type, sdp }) {
    this.answer = sdp
    return Promise.resolve()
  }

  addTrack(track, stream) {}

  getLocalSdp(constraints, type) {
    return Promise.resolve({ sdp: "test sdp offer", type: 'offer' })
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  sendDTMF(tones, duration, interToneGap) {}

  getLocalTracks() {
    return []
  }

  getRemoteTracks() {
    return []
  }

  // @ts-ignore
  setLocalSdp(sdp) {
    return Promise.resolve('')
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  removeTracks() {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close() {}
}
