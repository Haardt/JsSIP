import * as EventEmitter from "events";

export interface MediaConnection extends EventEmitter {
    createSdpOffer(rtcSessionDescription: RTCOfferOptions): Promise<RTCSessionDescription>

    createSdpAnswer(options: RTCOfferOptions): Promise<RTCSessionDescription>

    setLocalSdp(sdp: RTCSessionDescription): Promise<void>

    setRemoteSdp(sdp: RTCSessionDescription): Promise<void>

    sendDTMF(tones: number, duration: number, interToneGap: number): void

    getRemoteTracks(): Array<MediaStreamTrack>

    getLocalTracks(): Array<MediaStreamTrack>

    addTrack(track: MediaStreamTrack, stream: MediaStream): void

    removeTracks(): void

    close(): void
}
