import * as EventEmitter from "events";

type MediaConnectionType = 'NodeMediaConnection' | 'BrowserMediaConnection';

export interface MediaConnection extends EventEmitter {
    type: MediaConnectionType;

    // Getter
    iceConnectionState(): string;

    // Getter
    iceGatheringState(): RTCIceGatheringState;

    // Getter
    signalingState(): RTCSignalingState

    setup(pcConfig: any, rtcConstraints: any);

    receiveSdpOffer(options: any): Promise<RTCSessionDescriptionInit>

    receiveSdpAnswer(options: any): Promise<RTCSessionDescriptionInit>

    setLocalSdp(sdp: RTCSessionDescriptionInit): Promise<void>

    setRemoteDescription(sdp: RTCSessionDescriptionInit): Promise<void>

    getLocalSdp(): void

    addTrack(track: MediaStreamTrack, stream: MediaStream): void

    removeTracks(): void

    getSenders(): RTCRtpSender[];

    getLocalStreams(): MediaStream[];

    getRemoteStreams(): MediaStream[];

    // Delegate events
    addEventListener<K extends keyof RTCPeerConnectionEventMap>(type: K, listener: (this: RTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCPeerConnectionEventMap>(type: K, listener: (this: RTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

    close(): void;
}
