
import { motion } from "framer-motion";
import { Star, Clock, MapPin, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  rating: number;
  experience: number;
  location: string;
  price: number;
  availability: string;
  onClick?: () => void;
}

const DoctorCard = ({
  id,
  name,
  specialty,
  avatar,
  rating,
  experience,
  location,
  price,
  availability,
  onClick,
}: DoctorCardProps) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    // In a real app, navigate to doctor profile page
    console.log("View doctor profile:", id);
  };
  
  const handleBookConsultation = () => {
    if (onClick) {
      onClick();
    } else {
      // Use real data by including the doctorId in the URL
      navigate(`/patient-dashboard/book-doctor?doctorId=${id}`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover-scale">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16 border">
              <AvatarImage src={avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-medium">{name}</h3>
                <Badge variant="outline" className="ml-3 bg-primary/10 text-primary border-primary/20">
                  ${price}/hr
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{specialty}</p>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : i < rating
                          ? "fill-yellow-400/50 text-yellow-400/50"
                          : "fill-muted text-muted"
                      }`}
                    />
                  ))}
                </div>
                <span className="ml-1.5 text-xs text-muted-foreground">
                  {rating.toFixed(1)} ({Math.floor(Math.random() * 100) + 50} reviews)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1.5" />
              <span>{experience} yrs exp</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1.5" />
              <span>{location}</span>
            </div>
            <div className="flex items-center col-span-2">
              <Calendar className="h-4 w-4 mr-1.5" />
              <span>Available {availability}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex justify-between items-center w-full">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs"
              onClick={handleViewProfile}
            >
              View Profile
            </Button>
            <Button 
              variant="default" 
              size="sm"
              className="text-xs"
              onClick={handleBookConsultation}
            >
              Book Consultation
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DoctorCard;
