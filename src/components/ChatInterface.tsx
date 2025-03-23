
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Send, AlertTriangle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { db, Message, Consultation } from '@/services/database';

interface ChatInterfaceProps {
  consultationId: string;
  userId: string;
  userType: 'doctor' | 'patient';
  onClose?: () => void;
}

const ChatInterface = ({ consultationId, userId, userType, onClose }: ChatInterfaceProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isTimeValid, setIsTimeValid] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load consultation details and check if time has arrived
  useEffect(() => {
    const loadConsultation = () => {
      if (userType === 'patient') {
        const consultationData = db.consultations.getById(consultationId);
        setConsultation(consultationData);
        
        if (consultationData) {
          const consultDate = new Date(`${consultationData.date} ${consultationData.time}`);
          const now = new Date();
          
          // Time is valid if consultation date is in the past or within 5 minutes
          const isValid = consultDate.getTime() - now.getTime() <= 5 * 60 * 1000;
          setIsTimeValid(isValid);
          
          if (!isValid && !messages.length) {
            toast({
              title: "Consultation time not reached",
              description: `This consultation is scheduled for ${consultationData.date} at ${consultationData.time}`,
              variant: "destructive"
            });
          }
        }
      } else {
        // Doctors can access chat at any time
        setIsTimeValid(true);
      }
    };
    
    loadConsultation();
  }, [consultationId, userType, toast]);

  // Load existing messages
  useEffect(() => {
    const loadMessages = () => {
      const consultationMessages = db.messages.getByConsultationId(consultationId);
      setMessages(consultationMessages);
    };
    
    loadMessages();
    
    // Set up polling to check for new messages
    const intervalId = setInterval(loadMessages, 3000);
    
    return () => clearInterval(intervalId);
  }, [consultationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !isTimeValid) return;
    
    const messageData: Omit<Message, 'id'> = {
      consultationId,
      senderId: userId,
      senderType: userType,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    const createdMessage = db.messages.create(messageData);
    setMessages([...messages, createdMessage]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Chat</h3>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {!isTimeValid ? (
        <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-4">
            <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">Consultation time not reached</h3>
          <p className="text-sm text-muted-foreground mb-4">
            This chat will be available at your scheduled appointment time:
          </p>
          <div className="text-lg font-medium mb-2">
            {consultation?.date} at {consultation?.time}
          </div>
        </div>
      ) : (
        <>
          <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => {
                  const isCurrentUser = message.senderId === userId;
                  
                  return (
                    <div 
                      key={message.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          isCurrentUser 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 text-right mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t">
            <div className="flex items-center space-x-2">
              <Input 
                placeholder="Type a message..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <Button size="icon" onClick={sendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
