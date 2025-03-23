
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Mic, MicOff, Video as VideoIcon, VideoOff, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AgoraRTC, { IAgoraRTCClient, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { db, Consultation } from '@/services/database';
import { videoService } from '@/services/videoService';
import ChatInterface from './ChatInterface';

interface VideoConsultationProps {
  consultationId: string;
  userId: string;
  userType: 'doctor' | 'patient';
  onClose?: () => void;
}

// Initialize Agora client
const client: IAgoraRTCClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

const VideoConsultation = ({ consultationId, userId, userType, onClose }: VideoConsultationProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  
  const localVideoRef = useRef<HTMLDivElement>(null);
  const remoteVideoRef = useRef<HTMLDivElement>(null);

  // Get the consultation data
  useEffect(() => {
    const consultationData = db.consultations.getById(consultationId);
    if (consultationData) {
      setConsultation(consultationData);
    } else {
      toast({
        title: "Error",
        description: "Consultation not found",
        variant: "destructive",
      });
      if (onClose) onClose();
    }
  }, [consultationId, toast, onClose]);

  // Join the video channel when component mounts
  useEffect(() => {
    if (!consultation || !consultation.roomId) return;

    const setupVideoCall = async () => {
      try {
        // Initialize the client
        videoService.initializeClient();
        
        // Join the channel
        const { localVideoTrack, localAudioTrack } = await videoService.joinChannel(
          consultation.roomId!, 
          userId
        );

        // Display local video
        if (localVideoRef.current && localVideoTrack) {
          localVideoTrack.play(localVideoRef.current);
        }

        // Set up event listeners for remote users
        client.on('user-published', async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          
          if (mediaType === 'video' && remoteVideoRef.current) {
            user.videoTrack?.play(remoteVideoRef.current);
          }
          
          if (mediaType === 'audio') {
            user.audioTrack?.play();
          }
          
          setRemoteUsers(prevUsers => {
            if (prevUsers.find(u => u.uid === user.uid)) {
              return prevUsers;
            }
            return [...prevUsers, user];
          });
        });

        client.on('user-unpublished', (user, mediaType) => {
          if (mediaType === 'video') {
            user.videoTrack?.stop();
          }
          
          if (mediaType === 'audio') {
            user.audioTrack?.stop();
          }
          
          // Update remote users list
          setRemoteUsers(prevUsers => prevUsers.filter(u => u.uid !== user.uid));
        });
        
        toast({
          title: "Connected",
          description: "You've joined the video consultation",
        });
      } catch (error) {
        console.error('Failed to join video call:', error);
        toast({
          title: "Connection Error",
          description: "Failed to join the video consultation",
          variant: "destructive",
        });
      }
    };

    setupVideoCall();

    // Clean up when component unmounts
    return () => {
      videoService.leaveChannel();
    };
  }, [consultation, userId, toast]);

  const toggleVideo = () => {
    videoService.toggleVideo(!isVideoEnabled);
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    videoService.toggleAudio(!isAudioEnabled);
    setIsAudioEnabled(!isAudioEnabled);
  };

  const endCall = async () => {
    await videoService.leaveChannel();
    
    // If the doctor ended the call, mark consultation as completed
    if (userType === 'doctor' && consultation) {
      db.consultations.update(consultationId, { status: 'completed' });
      
      toast({
        title: "Consultation Completed",
        description: "You can now issue a prescription",
      });
    }
    
    if (onClose) onClose();
  };

  if (!consultation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col h-full"
    >
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center">
            <span>
              {userType === 'doctor' 
                ? `Consultation with ${consultation.patientName}` 
                : `Consultation with ${consultation.doctorName}`}
            </span>
            <Button variant="outline" size="sm" onClick={() => setIsChatOpen(!isChatOpen)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 grid grid-cols-4 gap-2 relative overflow-hidden">
          {/* Main video (remote user) */}
          <div className="col-span-4 h-full bg-gray-900 rounded-md overflow-hidden relative">
            <div 
              ref={remoteVideoRef} 
              className="w-full h-full flex items-center justify-center"
            >
              {remoteUsers.length === 0 && (
                <div className="text-white text-center p-4">
                  <div className="animate-pulse mb-2">Waiting for the other person to join...</div>
                  <div className="text-sm opacity-75">Make sure they have the consultation link</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Local video (small overlay) */}
          <div className="absolute bottom-4 right-4 w-1/4 h-1/4 bg-gray-800 rounded-md overflow-hidden shadow-lg">
            <div 
              ref={localVideoRef} 
              className="w-full h-full"
            />
          </div>
          
          {/* Chat sidebar if open */}
          {isChatOpen && (
            <div className="absolute top-0 right-0 h-full w-80 bg-background border-l border-border">
              <ChatInterface 
                consultationId={consultationId}
                userId={userId}
                userType={userType}
                onClose={() => setIsChatOpen(false)}
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <div className="w-full flex items-center justify-center space-x-4">
            <Button 
              variant={isAudioEnabled ? "outline" : "destructive"} 
              size="icon" 
              onClick={toggleAudio}
              className="rounded-full h-12 w-12"
            >
              {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="destructive" 
              size="icon" 
              onClick={endCall}
              className="rounded-full h-14 w-14"
            >
              <Phone className="h-6 w-6 rotate-135" />
            </Button>
            
            <Button 
              variant={isVideoEnabled ? "outline" : "destructive"} 
              size="icon" 
              onClick={toggleVideo}
              className="rounded-full h-12 w-12"
            >
              {isVideoEnabled ? <VideoIcon className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default VideoConsultation;
