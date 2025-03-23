
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';

// This would be a real Agora App ID in production
const APP_ID = 'temp-app-id'; // Replace with your Agora App ID

export interface User {
  uid: string | number;
  videoTrack: any;
  audioTrack: any;
}

// Initialize Agora client
let client: IAgoraRTCClient | null = null;
let localTracks = {
  videoTrack: null,
  audioTrack: null
};

export const videoService = {
  initializeClient: () => {
    if (!client) {
      client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    }
    return client;
  },

  joinChannel: async (channelName: string, uid: string): Promise<{
    localVideoTrack: any;
    localAudioTrack: any;
  }> => {
    if (!client) {
      client = videoService.initializeClient();
    }

    // Get a token from your server (in a real app)
    // For testing, we'll use a temporary token
    const token = null;

    // Join the channel
    await client.join(APP_ID, channelName, token, uid);

    // Create local tracks
    const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
    
    // Save local tracks
    localTracks.audioTrack = audioTrack;
    localTracks.videoTrack = videoTrack;

    // Publish local tracks
    await client.publish([audioTrack, videoTrack]);

    return {
      localVideoTrack: videoTrack,
      localAudioTrack: audioTrack
    };
  },

  leaveChannel: async () => {
    // Unpublish and close local tracks
    if (localTracks.audioTrack) {
      localTracks.audioTrack.close();
      localTracks.audioTrack = null;
    }
    
    if (localTracks.videoTrack) {
      localTracks.videoTrack.close();
      localTracks.videoTrack = null;
    }

    // Leave the channel
    if (client) {
      await client.leave();
    }
  },

  toggleAudio: (enabled: boolean) => {
    if (localTracks.audioTrack) {
      if (enabled) {
        localTracks.audioTrack.setEnabled(true);
      } else {
        localTracks.audioTrack.setEnabled(false);
      }
    }
  },

  toggleVideo: (enabled: boolean) => {
    if (localTracks.videoTrack) {
      if (enabled) {
        localTracks.videoTrack.setEnabled(true);
      } else {
        localTracks.videoTrack.setEnabled(false);
      }
    }
  }
};
