import * as EventEmitter from "events";

type MediaConnectionType = 'NodeMediaConnection' | 'BrowserMediaConnection';

export interface MediaConnection extends EventEmitter {
    receiveSdpOffer(options: any): Promise<RTCSessionDescriptionInit>

    receiveSdpAnswer(options: any): Promise<RTCSessionDescriptionInit>

    setLocalSdp(sdp: RTCSessionDescriptionInit): Promise<void>

    setRemoteDescription(sdp: RTCSessionDescriptionInit): Promise<void>

    sendInbandDTMF(tones: number, duration: number, interToneGap: number): void

    addTrack(track: MediaStreamTrack, stream: MediaStream): void

    removeTracks(): void

    close(): void;
}
