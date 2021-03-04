import * as EventEmitter from "events";

type MediaConnectionType = 'NodeMediaConnection' | 'BrowserMediaConnection';

export interface MediaConnection extends EventEmitter {
    createSdpOffer(rtcSessionDescription: RTCSessionDescription): Promise<void>

    createSdpAnswer(options: RTCOfferOptions): Promise<void>

    setLocalSdp(sdp: RTCSessionDescriptionInit): Promise<void>

    setRemoteSdp(sdp: RTCSessionDescriptionInit): Promise<void>

    sendInbandDTMF(tones: number, duration: number, interToneGap: number): void

    addTrack(track: MediaStreamTrack, stream: MediaStream): void

    removeTracks(): void

    close(): void;
}
