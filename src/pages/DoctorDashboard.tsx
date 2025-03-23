import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Calendar as CalendarIcon, Video, MessageSquare, Clock, User, CheckCircle, XCircle, Settings, Edit, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ConsultationCard from "@/components/ConsultationCard";
import VideoConsultation from "@/components/VideoConsultation";
import ChatInterface from "@/components/ChatInterface";
import PrescriptionForm from "@/components/PrescriptionForm";
import { db, Consultation, Doctor, Patient } from "@/services/database";
import { authService } from "@/services/auth";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState("appointments");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [appointmentCount, setAppointmentCount] = useState({ upcoming: 0, pending: 0, completed: 0 });
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [activeUsers, setActiveUsers] = useState(0);

  const currentUser = authService.getCurrentUser();
  const doctorId = currentUser?.doctorId || "";
  const doctor = db.doctors.getById(doctorId);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/login");
      return;
    }

    if (authService.getUserRole() !== 'doctor') {
      navigate("/");
      return;
    }

    loadConsultations();
    
    setActiveUsers(Math.floor(Math.random() * 10) + 5);
  }, [navigate]);

  const loadConsultations = () => {
    if (!doctorId) return;
    
    const allConsultations = db.consultations.getByDoctorId(doctorId);
    setConsultations(allConsultations);
    
    const counts = {
      upcoming: allConsultations.filter(c => c.status === 'upcoming').length,
      pending: allConsultations.filter(c => c.status === 'pending').length,
      completed: allConsultations.filter(c => c.status === 'completed').length
    };
    setAppointmentCount(counts);
  };

  const handleStartConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsVideoModalOpen(true);
  };

  const handleChat = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsChatModalOpen(true);
  };

  const handleWritePrescription = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setIsPrescriptionModalOpen(true);
  };

  const handleAcceptConsultation = (consultation: Consultation) => {
    db.consultations.update(consultation.id, {
      status: 'upcoming'
    });
    
    toast({
      title: "Consultation Accepted",
      description: `Consultation with ${consultation.patientName} has been scheduled.`,
    });
    
    loadConsultations();
  };

  const handleCompleteConsultation = (consultation: Consultation) => {
    db.consultations.update(consultation.id, {
      status: 'completed'
    });
    
    toast({
      title: "Consultation Completed",
      description: `Consultation with ${consultation.patientName} has been marked as completed.`,
    });
    
    loadConsultations();
  };

  const handleSavePrescription = (prescriptionData: any) => {
    if (!selectedConsultation) return;
    
    db.prescriptions.create({
      consultationId: selectedConsultation.id,
      patientId: selectedConsultation.patientId,
      patientName: selectedConsultation.patientName,
      diagnosis: prescriptionData.diagnosis,
      medications: JSON.stringify(prescriptionData.medications),
      notes: prescriptionData.notes,
      followUpDate: prescriptionData.followUpDate,
      issuedDate: new Date().toISOString().split('T')[0],
      signature: prescriptionData.signature || "Dr. Signature"
    });
    
    toast({
      title: "Prescription Saved",
      description: "The prescription has been created successfully.",
    });
    
    setIsPrescriptionModalOpen(false);
    loadConsultations();
  };

  const getFilteredConsultations = () => {
    if (tab === 'appointments') {
      return consultations.filter(c => c.status === 'upcoming');
    } else if (tab === 'pending') {
      return consultations.filter(c => c.status === 'pending');
    } else if (tab === 'history') {
      return consultations.filter(c => c.status === 'completed');
    }
    return consultations;
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (!doctor) {
    return <div className="container py-10">Loading doctor profile...</div>;
  }

  return (
    <div className="container py-6 max-w-7xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="text-muted-foreground">Manage your appointments and patient consultations</p>
          </div>
          <div className="flex space-x-4">
            <Button onClick={() => navigate("/doctor-settings")} variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Doctor Profile</CardTitle>
              <CardDescription>Your professional information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={doctor.avatar || "/placeholder.svg"} />
                <AvatarFallback>{doctor.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold">{doctor.name}</h3>
              <p className="text-muted-foreground mb-3">{doctor.specialty}</p>
              <div className="flex items-center mb-3">
                <Badge variant="secondary" className="mr-2">
                  ⭐ {doctor.rating.toFixed(1)}
                </Badge>
                <Badge variant="outline">{doctor.experience} Years Exp.</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{doctor.availability}</p>
              <Button variant="outline" className="w-full" onClick={() => navigate("/doctor-settings")}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Appointment Stats</CardTitle>
              <CardDescription>Overview of your consultations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-primary/10 rounded-lg">
                  <Clock className="h-6 w-6 text-primary mb-2" />
                  <p className="text-2xl font-bold">{appointmentCount.upcoming}</p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-yellow-500/10 rounded-lg">
                  <User className="h-6 w-6 text-yellow-500 mb-2" />
                  <p className="text-2xl font-bold">{appointmentCount.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
                <div className="flex flex-col items-center p-3 bg-green-500/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-500 mb-2" />
                  <p className="text-2xl font-bold">{appointmentCount.completed}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium">Active Patients</p>
                  <Badge variant="outline">{activeUsers} Online</Badge>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${(activeUsers / 20) * 100}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Your upcoming schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border mx-auto"
              />
              {date && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">{formatDate(date.toISOString())}</h4>
                  {consultations.filter(c => 
                    c.date === date.toISOString().split('T')[0] && 
                    c.status === 'upcoming'
                  ).length > 0 ? (
                    <ul className="space-y-2">
                      {consultations.filter(c => 
                        c.date === date.toISOString().split('T')[0] && 
                        c.status === 'upcoming'
                      ).map(consultation => (
                        <li key={consultation.id} className="text-sm p-2 border rounded-md">
                          <div className="font-medium">{consultation.patientName}</div>
                          <div className="text-muted-foreground">{consultation.time}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground text-sm">No appointments scheduled</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:w-[400px] mb-4">
            <TabsTrigger value="appointments">Upcoming</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {getFilteredConsultations().length > 0 ? (
                getFilteredConsultations().map(consultation => (
                  <motion.div key={consultation.id} variants={itemVariants}>
                    <ConsultationCard
                      id={consultation.id}
                      doctorName={consultation.doctorName}
                      doctorSpecialty={consultation.doctorSpecialty}
                      status={consultation.status}
                      date={consultation.date}
                      time={consultation.time}
                      type={consultation.type}
                      price={consultation.price}
                      onActionClick={() => handleStartConsultation(consultation)}
                      actionLabel="Start Consultation"
                      actionIcon={<Video className="mr-2 h-4 w-4" />}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleChat(consultation)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleWritePrescription(consultation)}>
                        <FileText className="mr-2 h-4 w-4" />
                        Prescription
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleCompleteConsultation(consultation)}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Complete
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 p-8 text-center">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <h3 className="text-lg font-medium">No upcoming appointments</h3>
                  <p className="text-muted-foreground">You don't have any upcoming appointments scheduled.</p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {getFilteredConsultations().length > 0 ? (
                getFilteredConsultations().map(consultation => (
                  <motion.div key={consultation.id} variants={itemVariants}>
                    <ConsultationCard
                      id={consultation.id}
                      doctorName={consultation.doctorName}
                      doctorSpecialty={consultation.doctorSpecialty}
                      status={consultation.status}
                      date={consultation.date}
                      time={consultation.time}
                      type={consultation.type}
                      price={consultation.price}
                      onActionClick={() => handleAcceptConsultation(consultation)}
                      actionLabel="Accept Request"
                      actionIcon={<CheckCircle className="mr-2 h-4 w-4" />}
                    />
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleChat(consultation)}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat
                      </Button>
                      <Button variant="destructive" size="sm" className="flex-1">
                        <XCircle className="mr-2 h-4 w-4" />
                        Decline
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 p-8 text-center">
                  <User className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <h3 className="text-lg font-medium">No pending requests</h3>
                  <p className="text-muted-foreground">You don't have any pending consultation requests.</p>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {getFilteredConsultations().length > 0 ? (
                getFilteredConsultations().map(consultation => (
                  <motion.div key={consultation.id} variants={itemVariants}>
                    <ConsultationCard
                      id={consultation.id}
                      doctorName={consultation.doctorName}
                      doctorSpecialty={consultation.doctorSpecialty}
                      status={consultation.status}
                      date={consultation.date}
                      time={consultation.time}
                      type={consultation.type}
                      price={consultation.price}
                      onActionClick={() => handleWritePrescription(consultation)}
                      actionLabel="View Details"
                    />
                    <div className="flex gap-2 mt-2">
                      {db.prescriptions.getByConsultationId(consultation.id) ? (
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="mr-2 h-4 w-4" />
                          Download Prescription
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleWritePrescription(consultation)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Write Prescription
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 p-8 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-2" />
                  <h3 className="text-lg font-medium">No consultation history</h3>
                  <p className="text-muted-foreground">You don't have any completed consultations yet.</p>
                </div>
              )}
            </motion.div>
          </TabsContent>
        </Tabs>

        <Dialog open={isVideoModalOpen} onOpenChange={setIsVideoModalOpen}>
          <DialogContent className="max-w-5xl p-0 h-[80vh]">
            {selectedConsultation && (
              <VideoConsultation
                consultationId={selectedConsultation.id}
                userId={doctorId}
                userType="doctor"
                onClose={() => setIsVideoModalOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
          <DialogContent className="max-w-2xl p-0 h-[80vh]">
            {selectedConsultation && (
              <ChatInterface
                consultationId={selectedConsultation.id}
                userId={doctorId}
                userType="doctor"
                onClose={() => setIsChatModalOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        <Dialog open={isPrescriptionModalOpen} onOpenChange={setIsPrescriptionModalOpen}>
          <DialogContent className="max-w-3xl">
            {selectedConsultation && (
              <PrescriptionForm
                patientName={selectedConsultation.patientName}
                patientId={selectedConsultation.patientId}
                consultationId={selectedConsultation.id}
                onComplete={handleSavePrescription}
                onCancel={() => setIsPrescriptionModalOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default DoctorDashboard;
