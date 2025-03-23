
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Stethoscope, Video, MessageSquare, Phone, FileText, ClipboardList } from "lucide-react";
import { Consultation } from "@/services/database";

interface ConsultationDetailsProps {
  consultation: Consultation | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
  onMessage: () => void;
}

const ConsultationDetails = ({ 
  consultation, 
  isOpen, 
  onClose,
  onJoin,
  onMessage
}: ConsultationDetailsProps) => {
  if (!consultation) return null;

  const getStatusColor = () => {
    switch (consultation.status) {
      case 'upcoming':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-400';
    }
  };

  const getTypeIcon = () => {
    switch (consultation.type) {
      case 'video':
        return <Video className="h-4 w-4 mr-1.5" />;
      case 'audio':
        return <Phone className="h-4 w-4 mr-1.5" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4 mr-1.5" />;
      default:
        return <Stethoscope className="h-4 w-4 mr-1.5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Consultation Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4 pb-4 border-b">
            <Avatar className="h-14 w-14 border">
              <AvatarFallback className="bg-primary/10 text-primary">
                {consultation.doctorName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium">{consultation.doctorName}</h3>
              <p className="text-sm text-muted-foreground">{consultation.doctorSpecialty}</p>
              <Badge 
                variant="outline" 
                className={`mt-1 text-xs ${getStatusColor()}`}
              >
                {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{consultation.date}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{consultation.time}</span>
            </div>
            
            <div className="flex items-center text-sm">
              {getTypeIcon()}
              <span>{consultation.type.charAt(0).toUpperCase() + consultation.type.slice(1)} Consultation</span>
            </div>
            
            <div className="flex items-center text-sm font-medium pt-1">
              <p>Price: ${consultation.price.toFixed(2)}</p>
              {consultation.paymentStatus === 'completed' && (
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-800 border-green-200">
                  Paid
                </Badge>
              )}
            </div>
          </div>
          
          {consultation.symptoms && (
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" /> Symptoms
              </h4>
              <p className="text-sm text-muted-foreground">
                {consultation.symptoms}
              </p>
            </div>
          )}
          
          {consultation.notes && (
            <div className="pt-2 border-t">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" /> Notes
              </h4>
              <p className="text-sm text-muted-foreground">
                {consultation.notes}
              </p>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            {consultation.status === 'upcoming' && (
              <Button className="flex-1" onClick={onJoin}>
                {consultation.type === 'video' ? <Video className="h-4 w-4 mr-2" /> : 
                 consultation.type === 'audio' ? <Phone className="h-4 w-4 mr-2" /> : 
                 <MessageSquare className="h-4 w-4 mr-2" />}
                Join {consultation.type === 'video' ? 'Video Call' : 
                      consultation.type === 'audio' ? 'Audio Call' : 'Chat'}
              </Button>
            )}
            
            <Button 
              variant={consultation.status === 'upcoming' ? "outline" : "default"} 
              className="flex-1"
              onClick={onMessage}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultationDetails;
