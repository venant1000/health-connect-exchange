
import { motion } from "framer-motion";
import { Calendar, Clock, Video, MessageSquare, Phone, Stethoscope } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ConsultationCardProps {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar?: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending';
  date: string;
  time: string;
  type: 'video' | 'audio' | 'chat';
  price: number;
  onClick?: () => void;
  onActionClick?: () => void;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
}

const ConsultationCard = ({
  id,
  doctorName,
  doctorSpecialty,
  doctorAvatar,
  status,
  date,
  time,
  type,
  price,
  onClick,
  onActionClick,
  actionLabel,
  actionIcon,
}: ConsultationCardProps) => {
  const getStatusColor = () => {
    switch (status) {
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
    switch (type) {
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
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover-scale">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={doctorAvatar} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {doctorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h4 className="text-base font-medium">{doctorName}</h4>
                <p className="text-sm text-muted-foreground">{doctorSpecialty}</p>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs font-medium ${getStatusColor()}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>{date}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>{time}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              {getTypeIcon()}
              <span>{type.charAt(0).toUpperCase() + type.slice(1)} Consultation</span>
            </div>
            <div className="mt-2 text-sm font-medium">
              Price: ${price.toFixed(2)}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between items-center w-full">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={onClick}
            >
              View Details
            </Button>
            {/* Custom action button based on provided props */}
            {actionLabel && onActionClick && (
              <Button 
                variant="default" 
                size="sm"
                className="text-xs"
                onClick={onActionClick}
              >
                {actionIcon}{actionIcon && ' '}{actionLabel}
              </Button>
            )}
            {/* Default action buttons based on status (used when actionLabel is not provided) */}
            {!actionLabel && status === 'upcoming' && (
              <Button 
                variant="default" 
                size="sm"
                className="text-xs"
              >
                Join Now
              </Button>
            )}
            {!actionLabel && status === 'completed' && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
              >
                Leave Review
              </Button>
            )}
            {!actionLabel && status === 'pending' && (
              <Button 
                variant="default" 
                size="sm"
                className="text-xs"
              >
                Confirm
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ConsultationCard;
