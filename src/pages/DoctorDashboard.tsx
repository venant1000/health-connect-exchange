
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ChevronRight, Clock, DollarSign, Users, FilePlus } from "lucide-react";
import Navbar from "@/components/Navbar";
import ConsultationCard from "@/components/ConsultationCard";
import UserProfile from "@/components/UserProfile";
import PrescriptionForm from "@/components/PrescriptionForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { db, initializeDatabase, Consultation } from "@/services/database";
import DoctorSettings from "./DoctorSettings";

// Initialize database with sample data if empty
initializeDatabase();

// Doctor ID - in a real app, get this from authentication/context
const DOCTOR_ID = "1";

const DoctorHome = () => {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [upcomingConsultations, setUpcomingConsultations] = useState<Consultation[]>([]);
  const [pendingConsultations, setPendingConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  
  // Get doctor info
  const doctor = db.doctors.getById(DOCTOR_ID);

  useEffect(() => {
    // Load consultations from database
    const allConsultations = db.consultations.getDoctorConsultations(DOCTOR_ID);
    const upcoming = db.consultations.getDoctorConsultations(DOCTOR_ID, 'upcoming');
    const pending = db.consultations.getDoctorConsultations(DOCTOR_ID, 'pending');
    
    setConsultations(allConsultations);
    setUpcomingConsultations(upcoming);
    setPendingConsultations(pending);
  }, []);

  const handleAcceptConsultation = (consultationId: string) => {
    // Update status in database
    db.consultations.update(consultationId, { status: 'upcoming' });
    
    // Refresh data
    const allConsultations = db.consultations.getDoctorConsultations(DOCTOR_ID);
    const upcoming = db.consultations.getDoctorConsultations(DOCTOR_ID, 'upcoming');
    const pending = db.consultations.getDoctorConsultations(DOCTOR_ID, 'pending');
    
    setConsultations(allConsultations);
    setUpcomingConsultations(upcoming);
    setPendingConsultations(pending);
    
    toast({
      title: "Consultation accepted",
      description: "The consultation request has been accepted.",
    });
  };

  const handleCompleteConsultation = (consultationId: string) => {
    // Get consultation details
    const consultation = db.consultations.getById(consultationId);
    if (!consultation) return;
    
    setSelectedConsultation(consultation);
    setShowPrescriptionForm(true);
  };

  const handlePrescriptionComplete = (prescriptionData: any) => {
    if (!selectedConsultation) return;
    
    // Update consultation status
    db.consultations.update(selectedConsultation.id, { 
      status: 'completed',
      prescription: prescriptionData
    });
    
    // Refresh data
    const allConsultations = db.consultations.getDoctorConsultations(DOCTOR_ID);
    const upcoming = db.consultations.getDoctorConsultations(DOCTOR_ID, 'upcoming');
    const pending = db.consultations.getDoctorConsultations(DOCTOR_ID, 'pending');
    
    setConsultations(allConsultations);
    setUpcomingConsultations(upcoming);
    setPendingConsultations(pending);
    
    setShowPrescriptionForm(false);
    setSelectedConsultation(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      {showPrescriptionForm && selectedConsultation ? (
        <div>
          <Button 
            variant="outline" 
            onClick={() => setShowPrescriptionForm(false)}
            className="mb-4"
          >
            ← Back to Dashboard
          </Button>
          <PrescriptionForm
            patientName={selectedConsultation.patientName}
            patientId={selectedConsultation.patientId}
            consultationId={selectedConsultation.id}
            onComplete={handlePrescriptionComplete}
            onCancel={() => setShowPrescriptionForm(false)}
          />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-semibold mb-6">Welcome, {doctor?.name || 'Doctor'}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-health-600 to-health-700 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Next Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingConsultations.length > 0 ? (
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-lg">{upcomingConsultations[0].patientName}</p>
                      <p className="text-sm opacity-90">Patient</p>
                      <div className="mt-2 opacity-90 flex items-center text-sm">
                        <div className="flex items-center">
                          {upcomingConsultations[0].date}, {upcomingConsultations[0].time}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-white h-8 px-2" 
                      size="sm"
                      onClick={() => handleCompleteConsultation(upcomingConsultations[0].id)}
                    >
                      Start <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <p className="opacity-80">No upcoming appointments</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Today's Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingConsultations.slice(0, 3).map((consult, index) => (
                    <div key={consult.id} className="flex justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-health-500 rounded-full mr-2"></div>
                        <span>{consult.time}</span>
                      </div>
                      <span className="text-sm font-medium">{consult.patientName}</span>
                    </div>
                  ))}
                  {upcomingConsultations.length === 0 && (
                    <p className="text-muted-foreground text-sm">No consultations scheduled for today</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">${consultations.reduce((sum, consult) => sum + consult.price, 0).toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mb-2">This month</p>
                <Button variant="outline" size="sm">View Details</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-health-500 mr-3" />
                    <div>
                      <p className="text-2xl font-semibold">{consultations.length}</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+{Math.floor(consultations.length * 0.1)}%</p>
                    <p className="text-xs text-muted-foreground">vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-health-500 mr-3" />
                    <div>
                      <p className="text-2xl font-semibold">${consultations.reduce((sum, consult) => sum + consult.price, 0).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">This month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+8%</p>
                    <p className="text-xs text-muted-foreground">vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-health-500 mr-3" />
                    <div>
                      <p className="text-2xl font-semibold">{new Set(consultations.map(c => c.patientId)).size}</p>
                      <p className="text-sm text-muted-foreground">Total patients</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+5</p>
                    <p className="text-xs text-muted-foreground">vs last month</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {pendingConsultations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Appointment Requests</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingConsultations.map((consult) => (
                  <ConsultationCard
                    key={consult.id}
                    id={consult.id}
                    doctorName={consult.patientName}
                    doctorSpecialty="Patient"
                    status={consult.status}
                    date={consult.date}
                    time={consult.time}
                    type={consult.type}
                    price={consult.price}
                    onActionClick={() => handleAcceptConsultation(consult.id)}
                    actionLabel="Accept Request"
                  />
                ))}
              </div>
            </div>
          )}
          
          {upcomingConsultations.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Upcoming Consultations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingConsultations.map((consult) => (
                  <ConsultationCard
                    key={consult.id}
                    id={consult.id}
                    doctorName={consult.patientName}
                    doctorSpecialty="Patient"
                    status={consult.status}
                    date={consult.date}
                    time={consult.time}
                    type={consult.type}
                    price={consult.price}
                    onActionClick={() => handleCompleteConsultation(consult.id)}
                    actionLabel="Write Prescription"
                    actionIcon={<FilePlus className="h-4 w-4 mr-2" />}
                  />
                ))}
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" className="mt-2">
                  View All Appointments
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

const DoctorAppointments = () => {
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  useEffect(() => {
    // Load consultations from database
    const allConsultations = db.consultations.getDoctorConsultations(DOCTOR_ID);
    setConsultations(allConsultations);
  }, []);

  const handleAcceptConsultation = (consultationId: string) => {
    // Update status in database
    db.consultations.update(consultationId, { status: 'upcoming' });
    
    // Refresh data
    const allConsultations = db.consultations.getDoctorConsultations(DOCTOR_ID);
    setConsultations(allConsultations);
    
    toast({
      title: "Consultation accepted",
      description: "The consultation request has been accepted.",
    });
  };

  const handleCompleteConsultation = (consultationId: string) => {
    // Get consultation details
    const consultation = db.consultations.getById(consultationId);
    if (!consultation) return;
    
    setSelectedConsultation(consultation);
    setShowPrescriptionForm(true);
  };

  const handlePrescriptionComplete = (prescriptionData: any) => {
    if (!selectedConsultation) return;
    
    // Update consultation status
    db.consultations.update(selectedConsultation.id, { 
      status: 'completed',
      prescription: prescriptionData
    });
    
    // Refresh data
    const allConsultations = db.consultations.getDoctorConsultations(DOCTOR_ID);
    setConsultations(allConsultations);
    
    setShowPrescriptionForm(false);
    setSelectedConsultation(null);
    
    toast({
      title: "Consultation completed",
      description: "The prescription has been issued to the patient.",
    });
  };

  const filteredConsultations = (status?: Consultation['status']) => {
    if (!status) return consultations;
    return consultations.filter(c => c.status === status);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      {showPrescriptionForm && selectedConsultation ? (
        <div>
          <Button 
            variant="outline" 
            onClick={() => setShowPrescriptionForm(false)}
            className="mb-4"
          >
            ← Back to Appointments
          </Button>
          <PrescriptionForm
            patientName={selectedConsultation.patientName}
            patientId={selectedConsultation.patientId}
            consultationId={selectedConsultation.id}
            onComplete={handlePrescriptionComplete}
            onCancel={() => setShowPrescriptionForm(false)}
          />
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-semibold mb-6">My Appointments</h1>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {consultations.length > 0 ? (
                  consultations.map((consult) => (
                    <ConsultationCard
                      key={consult.id}
                      id={consult.id}
                      doctorName={consult.patientName}
                      doctorSpecialty="Patient"
                      status={consult.status}
                      date={consult.date}
                      time={consult.time}
                      type={consult.type}
                      price={consult.price}
                      onActionClick={
                        consult.status === 'pending' 
                          ? () => handleAcceptConsultation(consult.id)
                          : consult.status === 'upcoming'
                          ? () => handleCompleteConsultation(consult.id)
                          : undefined
                      }
                      actionLabel={
                        consult.status === 'pending' 
                          ? "Accept Request" 
                          : consult.status === 'upcoming'
                          ? "Write Prescription"
                          : undefined
                      }
                      actionIcon={
                        consult.status === 'upcoming' 
                          ? <FilePlus className="h-4 w-4 mr-2" />
                          : undefined
                      }
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-muted-foreground">No consultations found</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="upcoming">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConsultations('upcoming').length > 0 ? (
                  filteredConsultations('upcoming').map((consult) => (
                    <ConsultationCard
                      key={consult.id}
                      id={consult.id}
                      doctorName={consult.patientName}
                      doctorSpecialty="Patient"
                      status={consult.status}
                      date={consult.date}
                      time={consult.time}
                      type={consult.type}
                      price={consult.price}
                      onActionClick={() => handleCompleteConsultation(consult.id)}
                      actionLabel="Write Prescription"
                      actionIcon={<FilePlus className="h-4 w-4 mr-2" />}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-muted-foreground">No upcoming consultations</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="pending">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConsultations('pending').length > 0 ? (
                  filteredConsultations('pending').map((consult) => (
                    <ConsultationCard
                      key={consult.id}
                      id={consult.id}
                      doctorName={consult.patientName}
                      doctorSpecialty="Patient"
                      status={consult.status}
                      date={consult.date}
                      time={consult.time}
                      type={consult.type}
                      price={consult.price}
                      onActionClick={() => handleAcceptConsultation(consult.id)}
                      actionLabel="Accept Request"
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-muted-foreground">No pending requests</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredConsultations('completed').length > 0 ? (
                  filteredConsultations('completed').map((consult) => (
                    <ConsultationCard
                      key={consult.id}
                      id={consult.id}
                      doctorName={consult.patientName}
                      doctorSpecialty="Patient"
                      status={consult.status}
                      date={consult.date}
                      time={consult.time}
                      type={consult.type}
                      price={consult.price}
                    />
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8">
                    <p className="text-muted-foreground">No completed consultations</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </motion.div>
  );
};

const DoctorProfile = () => {
  const doctor = db.doctors.getById(DOCTOR_ID);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">My Profile</h1>
      
      {doctor && (
        <UserProfile
          userType="doctor"
          name={doctor.name}
          specialty={doctor.specialty}
          email={doctor.email}
          phone={doctor.phone}
          location={doctor.location}
          experience={doctor.experience}
          bio={doctor.bio}
          education={doctor.education}
          availability={doctor.availability}
          onEdit={() => console.log("Edit profile")}
        />
      )}
    </motion.div>
  );
};

const DoctorMessages = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">Messages</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Messages</CardTitle>
          <CardDescription>
            Stay in touch with your patients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-12 text-muted-foreground">Message feature will be implemented in the next version.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DoctorDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/doctor-dashboard') {
      // If we're at the root of the dashboard, don't redirect
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="doctor" />
      <main>
        <Routes>
          <Route path="/" element={<DoctorHome />} />
          <Route path="/appointments" element={<DoctorAppointments />} />
          <Route path="/profile" element={<DoctorProfile />} />
          <Route path="/messages" element={<DoctorMessages />} />
          <Route path="/settings" element={<DoctorSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default DoctorDashboard;
