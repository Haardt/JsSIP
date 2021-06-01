import * as EventEmitter from "events";

export interface MediaConnectionInterface extends EventEmitter {
    createSdpOffer(options: RTCOfferOptions): Promise<RTCSessionDescription>

    createSdpAnswer(options: RTCOfferOptions): Promise<RTCSessionDescription>

    setRemoteSdp(sdp: RTCSessionDescription): Promise<void>

    setLocalSdp(sdp: RTCSessionDescription): Promise<void>

    addTrack(track: MediaStreamTrack, stream: MediaStream): void

    getLocalTracks(): Array<MediaStreamTrack>

    getRemoteTracks(): Array<MediaStreamTrack>

    removeTracks(): void

    sendDTMF(tones: number, duration: number, interToneGap: number): void

    close(): void
}
