
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Clock, 
  Video, 
  MessageSquare, 
  Phone,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { db, Doctor, Consultation } from "@/services/database";
import { useAuth } from "@/services/auth";

// Available time slots
const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM"
];

const consultationTypes = [
  { id: "video", label: "Video Call", icon: Video },
  { id: "audio", label: "Audio Call", icon: Phone },
  { id: "chat", label: "Chat", icon: MessageSquare },
];

const BookDoctorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const doctorIdParam = searchParams.get('doctorId');
  const { toast } = useToast();
  const { user, patientId } = useAuth();
  
  // State for doctors
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Booking state
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string | undefined>();
  const [consultationType, setConsultationType] = useState<"video" | "audio" | "chat">("video");
  const [bookingStep, setBookingStep] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isFound, setIsFound] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Fetch doctors from the database
  useEffect(() => {
    const fetchDoctors = () => {
      const allDoctors = db.doctors.getAll();
      const approvedDoctors = allDoctors.filter(doctor => doctor.status === 'approved');
      setDoctors(approvedDoctors);
      
      // If doctorId is provided in URL params, select that doctor
      if (doctorIdParam) {
        const doctor = approvedDoctors.find(d => d.id === doctorIdParam);
        if (doctor) {
          setSelectedDoctor(doctor);
        }
      }
    };
    
    fetchDoctors();
  }, [doctorIdParam]);

  // Simulate searching for available doctors
  useEffect(() => {
    if (isSearching) {
      const timer = setTimeout(() => {
        setIsSearching(false);
        setIsFound(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isSearching]);

  const handleSearch = () => {
    if (!date || !time) {
      toast({
        title: "Please select date and time",
        description: "A date and time are required to book a consultation",
        variant: "destructive",
      });
      return;
    }
    
    setIsSearching(true);
    setBookingStep(2);
  };

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setBookingStep(3);
  };

  const handleConfirm = () => {
    if (!selectedDoctor || !patientId || !date || !time) {
      toast({
        title: "Booking failed",
        description: "Missing required information for booking",
        variant: "destructive",
      });
      return;
    }

    // Create a new consultation in the database
    const patient = db.patients.getById(patientId);
    
    if (!patient) {
      toast({
        title: "Booking failed",
        description: "Patient information not found",
        variant: "destructive",
      });
      return;
    }

    const formattedDate = format(date, "MMM d, yyyy");
    const totalPrice = selectedDoctor.price * 1.05; // Including platform fee

    // Create the consultation
    const newConsultation: Omit<Consultation, 'id'> = {
      doctorId: selectedDoctor.id,
      patientId: patientId,
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      patientName: patient.name,
      status: 'pending',
      date: formattedDate,
      time: time,
      type: consultationType,
      price: selectedDoctor.price,
      paymentStatus: 'pending',
      symptoms: "" // Can be updated later
    };

    const createdConsultation = db.consultations.create(newConsultation);
    
    // Create transaction for the consultation
    db.transactions.payForConsultation(
      patientId, 
      createdConsultation.id, 
      totalPrice, 
      selectedDoctor.name
    );

    // Update consultation payment status
    db.consultations.update(createdConsultation.id, {
      paymentStatus: 'completed'
    });

    setIsConfirmed(true);
    setShowConfirmation(true);
  };

  const handleBookingComplete = () => {
    setShowConfirmation(false);
    navigate("/patient-dashboard/consultations");
    
    toast({
      title: "Booking successful!",
      description: `Your appointment with ${selectedDoctor?.name} is confirmed for ${date && format(date, "MMM d, yyyy")} at ${time}.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-2xl"
    >
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/patient-dashboard")} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-semibold">Book a Consultation</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 1 ? 'bg-primary text-white' : 'bg-muted'}`}>
            1
          </div>
          <span className="text-xs mt-1">Select Time</span>
        </div>
        <div className="flex-1 h-1 mx-2 bg-muted">
          <div className={`h-full bg-primary transition-all ${bookingStep >= 2 ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 2 ? 'bg-primary text-white' : 'bg-muted'}`}>
            2
          </div>
          <span className="text-xs mt-1">Find Doctor</span>
        </div>
        <div className="flex-1 h-1 mx-2 bg-muted">
          <div className={`h-full bg-primary transition-all ${bookingStep >= 3 ? 'w-full' : 'w-0'}`}></div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bookingStep >= 3 ? 'bg-primary text-white' : 'bg-muted'}`}>
            3
          </div>
          <span className="text-xs mt-1">Confirm</span>
        </div>
      </div>

      {bookingStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-xl font-medium">Select Consultation Details</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time picker */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Time</label>
                <Select onValueChange={setTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{slot}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Consultation type */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Consultation Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {consultationTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.id}
                        type="button"
                        variant={consultationType === type.id ? "default" : "outline"}
                        className="flex flex-col h-auto py-4"
                        onClick={() => setConsultationType(type.id as "video" | "audio" | "chat")}
                      >
                        <Icon className="h-5 w-5 mb-1" />
                        <span className="text-xs">{type.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSearch}>
                Search for Available Doctors
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {bookingStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-xl font-medium">Finding Available Doctors</h2>
            </CardHeader>
            <CardContent>
              {isSearching && (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
                  </div>
                  <p className="mt-4 text-muted-foreground">Searching for available doctors...</p>
                </div>
              )}

              {isFound && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Available doctors for {date && format(date, "MMM d, yyyy")} at {time}:
                  </p>
                  
                  {doctors.length > 0 ? (
                    doctors.map(doctor => (
                      <div 
                        key={doctor.id}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => handleSelectDoctor(doctor)}
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage src={doctor.avatar} />
                            <AvatarFallback className="bg-primary/10 text-primary text-lg">
                              {doctor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">{doctor.name}</h3>
                            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                            <div className="flex items-center mt-1">
                              <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                              <span className="text-xs text-muted-foreground">{doctor.location}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              ${doctor.price}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">Available {doctor.availability}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p>No doctors available at the moment.</p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => setBookingStep(1)}
                      >
                        Try different time
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setBookingStep(1)}>
                Back
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {bookingStep === 3 && selectedDoctor && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-4">
              <h2 className="text-xl font-medium">Review & Confirm</h2>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border">
                  <AvatarImage src={selectedDoctor.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedDoctor.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{selectedDoctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
                  <div className="flex items-center mt-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground mr-1" />
                    <span className="text-xs text-muted-foreground">{selectedDoctor.location}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Date</span>
                  </div>
                  <span className="font-medium">{date && format(date, "MMMM d, yyyy")}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">Time</span>
                  </div>
                  <span className="font-medium">{time}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {consultationType === "video" && <Video className="h-4 w-4 mr-2 text-muted-foreground" />}
                    {consultationType === "audio" && <Phone className="h-4 w-4 mr-2 text-muted-foreground" />}
                    {consultationType === "chat" && <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />}
                    <span className="text-sm">Consultation Type</span>
                  </div>
                  <span className="font-medium">
                    {consultationType.charAt(0).toUpperCase() + consultationType.slice(1)} Call
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Consultation Fee</span>
                  <span>${selectedDoctor.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Platform Fee</span>
                  <span>${(selectedDoctor.price * 0.05).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-medium">${(selectedDoctor.price * 1.05).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setBookingStep(2)}>
                Back
              </Button>
              <Button onClick={handleConfirm}>
                Confirm & Pay
              </Button>
            </CardFooter>
          </Card>

          {/* Confirmation Dialog */}
          <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Booking Confirmed!</DialogTitle>
                <DialogDescription>
                  Your appointment has been successfully booked.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-center mb-1">{selectedDoctor.name}</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">{selectedDoctor.specialty}</p>
                <div className="w-full space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date:</span>
                    <span className="text-sm">{date && format(date, "MMMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Time:</span>
                    <span className="text-sm">{time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span className="text-sm">{consultationType.charAt(0).toUpperCase() + consultationType.slice(1)} Call</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleBookingComplete} className="w-full">
                  View My Consultations
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BookDoctorPage;
