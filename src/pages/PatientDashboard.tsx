import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, Filter, MapPin, ArrowRight, ChevronRight, Video, MessageSquare, X, Download, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import DoctorCard from "@/components/DoctorCard";
import ConsultationCard from "@/components/ConsultationCard";
import UserProfile from "@/components/UserProfile";
import WalletCard from "@/components/WalletCard";
import WalletHistory from "@/components/WalletHistory";
import HealthStatusCard from "@/components/HealthStatusCard";
import ConsultationDetails from "@/components/ConsultationDetails";
import VideoConsultation from "@/components/VideoConsultation";
import ChatInterface from "@/components/ChatInterface";
import PrescriptionViewer from "@/components/PrescriptionViewer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { db, Consultation, Patient, Transaction, HealthMetric, UserProfileData } from "@/services/database";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BookDoctorPage from "./BookDoctorPage";

const prescriptionsData = [
  {
    id: "1",
    patientName: "John Doe",
    doctorName: "Dr. Emma Wilson",
    date: "October 15, 2023",
    medications: [
      { name: "Amoxicillin", dosage: "500mg", frequency: "3 times daily", duration: "7 days" },
      { name: "Ibuprofen", dosage: "400mg", frequency: "As needed", duration: "5 days" }
    ],
    notes: "Take with food. Complete the full course of antibiotics even if you start feeling better."
  },
  {
    id: "2",
    patientName: "John Doe",
    doctorName: "Dr. Michael Chen",
    date: "September 3, 2023",
    medications: [
      { name: "Loratadine", dosage: "10mg", frequency: "Once daily", duration: "30 days" }
    ],
    notes: "For seasonal allergies. Take in the morning."
  }
];

const patientData: Patient = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  phone: "+1 (555) 123-4567",
  location: "New York, NY",
  status: "active",
  joinedDate: "2023-01-15"
};

const transactionsData: Transaction[] = [
  {
    id: "1",
    type: 'credit',
    amount: 150,
    date: "Oct 10, 2023",
    description: "Added funds via credit card"
  },
  {
    id: "2",
    type: 'debit',
    amount: 100,
    date: "Oct 12, 2023",
    description: "Payment for Dr. Emma Wilson consultation"
  },
  {
    id: "3",
    type: 'credit',
    amount: 200,
    date: "Oct 20, 2023",
    description: "Added funds via credit card"
  },
  {
    id: "4",
    type: 'debit',
    amount: 90,
    date: "Oct 22, 2023",
    description: "Payment for Dr. Michael Chen consultation"
  }
];

const healthMetricsData = {
  lastCheckup: "Sep 23, 2023",
  nextCheckup: "Dec 23, 2023",
  notes: "Patient shows good overall health. Blood pressure is slightly elevated, recommended to reduce sodium intake and increase physical activity.",
  metrics: [
    {
      name: "Blood Pressure",
      value: 135,
      unit: "mmHg",
      normalRange: "90-120 mmHg",
      status: 'warning' as const
    },
    {
      name: "Heart Rate",
      value: 72,
      unit: "bpm",
      normalRange: "60-100 bpm",
      status: 'normal' as const
    },
    {
      name: "Cholesterol",
      value: 190,
      unit: "mg/dL",
      normalRange: "<200 mg/dL",
      status: 'normal' as const
    },
    {
      name: "Blood Sugar",
      value: 110,
      unit: "mg/dL",
      normalRange: "70-99 mg/dL",
      status: 'warning' as const
    }
  ]
};

const PatientHome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wallet, setWallet] = useState({ balance: 350 });
  const [showWalletHistory, setShowWalletHistory] = useState(false);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<Patient | null>(null);
  
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setLoggedInUser(JSON.parse(currentUser));
    } else {
      setLoggedInUser(patientData);
    }
    
    const patientConsultations = db.consultations.getByPatientId("1");
    setConsultations(patientConsultations);
  }, []);
  
  const handleAddFunds = (amount: number) => {
    setWallet(prev => ({ 
      balance: prev.balance + amount 
    }));
    
    toast({
      title: "Funds added successfully",
      description: `$${amount.toFixed(2)} has been added to your wallet.`,
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">Welcome, {loggedInUser?.name || "Patient"}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-health-600 to-health-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Next Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            {consultations.filter(c => c.status === 'upcoming').length > 0 ? (
              consultations
                .filter(c => c.status === 'upcoming')
                .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                .slice(0, 1)
                .map(consultation => (
                  <div key={consultation.id} className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-lg">{consultation.doctorName}</p>
                      <p className="text-sm opacity-90">{consultation.doctorSpecialty}</p>
                      <div className="mt-2 opacity-90 flex items-center text-sm">
                        <div className="flex items-center">
                          {consultation.date}, {consultation.time}
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="text-white h-8 px-2" 
                      size="sm"
                      onClick={() => navigate('/patient-dashboard/consultations')}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
            ) : (
              <div className="py-2">
                <p className="text-sm opacity-90">No upcoming appointments</p>
                <Button 
                  variant="ghost" 
                  className="text-white px-0 mt-2 h-8" 
                  size="sm"
                  onClick={() => navigate('/patient-dashboard/book')}
                >
                  Book a consultation <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <WalletCard 
          balance={wallet.balance} 
          onAddFunds={handleAddFunds}
          onViewHistory={() => setShowWalletHistory(true)}
        />
        
        <HealthStatusCard healthData={healthMetricsData} />
      </div>
      
      <WalletHistory 
        transactions={transactionsData}
        open={showWalletHistory}
        onClose={() => setShowWalletHistory(false)}
      />
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-2xl font-semibold">Find Doctors</h2>
          <Button onClick={() => navigate("/patient-dashboard/book")} className="mt-3 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Request Consultation
          </Button>
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Consultations</h2>
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultations
                .filter((consult) => consult.status === "upcoming")
                .map((consult) => (
                  <ConsultationCard
                    key={consult.id}
                    id={consult.id}
                    doctorName={consult.doctorName}
                    doctorSpecialty={consult.doctorSpecialty}
                    status={consult.status}
                    date={consult.date}
                    time={consult.time}
                    type={consult.type}
                    price={consult.price}
                    onClick={() => navigate(`/patient-dashboard/consultations?id=${consult.id}`)}
                    onActionClick={() => navigate(`/patient-dashboard/consultations?id=${consult.id}&join=true`)}
                  />
                ))}
            </div>
            {consultations.filter((consult) => consult.status === "upcoming").length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No upcoming consultations
              </div>
            )}
          </TabsContent>
          <TabsContent value="pending">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultations
                .filter((consult) => consult.status === "pending")
                .map((consult) => (
                  <ConsultationCard
                    key={consult.id}
                    id={consult.id}
                    doctorName={consult.doctorName}
                    doctorSpecialty={consult.doctorSpecialty}
                    status={consult.status}
                    date={consult.date}
                    time={consult.time}
                    type={consult.type}
                    price={consult.price}
                    onClick={() => navigate(`/patient-dashboard/consultations?id=${consult.id}`)}
                  />
                ))}
            </div>
            {consultations.filter((consult) => consult.status === "pending").length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No pending consultations
              </div>
            )}
          </TabsContent>
          <TabsContent value="completed">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {consultations
                .filter((consult) => consult.status === "completed")
                .map((consult) => (
                  <ConsultationCard
                    key={consult.id}
                    id={consult.id}
                    doctorName={consult.doctorName}
                    doctorSpecialty={consult.doctorSpecialty}
                    status={consult.status}
                    date={consult.date}
                    time={consult.time}
                    type={consult.type}
                    price={consult.price}
                    onClick={() => navigate(`/patient-dashboard/consultations?id=${consult.id}`)}
                  />
                ))}
            </div>
            {consultations.filter((consult) => consult.status === "completed").length === 0 && (
              <div className="text-center py-10 text-muted-foreground">
                No completed consultations
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

const PatientConsultations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showConsultationDetails, setShowConsultationDetails] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const consultationId = queryParams.get('id');
  const joinConsultation = queryParams.get('join') === 'true';

  useEffect(() => {
    const patientConsultations = db.consultations.getByPatientId("1");
    setConsultations(patientConsultations);

    if (consultationId) {
      const consultation = patientConsultations.find(c => c.id === consultationId);
      if (consultation) {
        setSelectedConsultation(consultation);
        setShowConsultationDetails(true);
        
        if (joinConsultation && consultation.status === 'upcoming') {
          if (consultation.type === 'video' || consultation.type === 'audio') {
            setShowVideo(true);
          } else {
            setShowChat(true);
          }
        }
      }
    }
  }, [consultationId, joinConsultation]);

  const handleJoinConsultation = () => {
    if (!selectedConsultation) return;
    
    if (selectedConsultation.status !== 'upcoming') {
      toast({
        title: "Cannot join consultation",
        description: "You can only join upcoming consultations.",
        variant: "destructive"
      });
      return;
    }
    
    const consultDate = new Date(`${selectedConsultation.date} ${selectedConsultation.time}`);
    const now = new Date();
    const timeUntilConsult = consultDate.getTime() - now.getTime();
    
    if (timeUntilConsult > 5 * 60 * 1000) {
      toast({
        title: "Consultation not started yet",
        description: `Your consultation is scheduled for ${selectedConsultation.date} at ${selectedConsultation.time}. You can join 5 minutes before the scheduled time.`,
        variant: "destructive"
      });
      return;
    }
    
    if (selectedConsultation.type === 'video' || selectedConsultation.type === 'audio') {
      setShowVideo(true);
    } else {
      setShowChat(true);
    }
  };

  const handleCloseDetails = () => {
    setShowConsultationDetails(false);
    setSelectedConsultation(null);
    
    navigate('/patient-dashboard/consultations');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">My Consultations</h1>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultations.map((consult) => (
              <ConsultationCard
                key={consult.id}
                id={consult.id}
                doctorName={consult.doctorName}
                doctorSpecialty={consult.doctorSpecialty}
                status={consult.status}
                date={consult.date}
                time={consult.time}
                type={consult.type}
                price={consult.price}
                onClick={() => {
                  setSelectedConsultation(consult);
                  setShowConsultationDetails(true);
                  navigate(`/patient-dashboard/consultations?id=${consult.id}`);
                }}
                actionLabel={consult.status === 'upcoming' ? "Join Now" : undefined}
                actionIcon={consult.status === 'upcoming' ? (
                  consult.type === 'video' ? <Video className="h-4 w-4 mr-1" /> : 
                  consult.type === 'chat' ? <MessageSquare className="h-4 w-4 mr-1" /> : null
                ) : undefined}
                onActionClick={consult.status === 'upcoming' ? () => {
                  setSelectedConsultation(consult);
                  navigate(`/patient-dashboard/consultations?id=${consult.id}&join=true`);
                } : undefined}
              />
            ))}
          </div>
          {consultations.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No consultations found
            </div>
          )}
        </TabsContent>
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultations
              .filter((consult) => consult.status === "upcoming")
              .map((consult) => (
                <ConsultationCard
                  key={consult.id}
                  id={consult.id}
                  doctorName={consult.doctorName}
                  doctorSpecialty={consult.doctorSpecialty}
                  status={consult.status}
                  date={consult.date}
                  time={consult.time}
                  type={consult.type}
                  price={consult.price}
                  onClick={() => {
                    setSelectedConsultation(consult);
                    setShowConsultationDetails(true);
                    navigate(`/patient-dashboard/consultations?id=${consult.id}`);
                  }}
                  actionLabel="Join Now"
                  actionIcon={
                    consult.type === 'video' ? <Video className="h-4 w-4 mr-1" /> : 
                    consult.type === 'chat' ? <MessageSquare className="h-4 w-4 mr-1" /> : null
                  }
                  onActionClick={() => {
                    setSelectedConsultation(consult);
                    navigate(`/patient-dashboard/consultations?id=${consult.id}&join=true`);
                  }}
                />
              ))}
          </div>
          {consultations.filter((consult) => consult.status === "upcoming").length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No upcoming consultations
            </div>
          )}
        </TabsContent>
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultations
              .filter((consult) => consult.status === "pending")
              .map((consult) => (
                <ConsultationCard
                  key={consult.id}
                  id={consult.id}
                  doctorName={consult.doctorName}
                  doctorSpecialty={consult.doctorSpecialty}
                  status={consult.status}
                  date={consult.date}
                  time={consult.time}
                  type={consult.type}
                  price={consult.price}
                  onClick={() => {
                    setSelectedConsultation(consult);
                    setShowConsultationDetails(true);
                    navigate(`/patient-dashboard/consultations?id=${consult.id}`);
                  }}
                />
              ))}
          </div>
          {consultations.filter((consult) => consult.status === "pending").length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No pending consultations
            </div>
          )}
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {consultations
              .filter((consult) => consult.status === "completed")
              .map((consult) => (
                <ConsultationCard
                  key={consult.id}
                  id={consult.id}
                  doctorName={consult.doctorName}
                  doctorSpecialty={consult.doctorSpecialty}
                  status={consult.status}
                  date={consult.date}
                  time={consult.time}
                  type={consult.type}
                  price={consult.price}
                  onClick={() => {
                    setSelectedConsultation(consult);
                    setShowConsultationDetails(true);
                    navigate(`/patient-dashboard/consultations?id=${consult.id}`);
                  }}
                />
              ))}
          </div>
          {consultations.filter((consult) => consult.status === "completed").length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No completed consultations
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <ConsultationDetails
        consultation={selectedConsultation}
        isOpen={showConsultationDetails}
        onClose={handleCloseDetails}
        onJoin={handleJoinConsultation}
        onMessage={() => setShowChat(true)}
      />
      
      {showVideo && selectedConsultation && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">
              {selectedConsultation.type.charAt(0).toUpperCase() + selectedConsultation.type.slice(1)} Consultation with {selectedConsultation.doctorName}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowVideo(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1">
            <VideoConsultation
              consultationId={selectedConsultation.id}
              userId="1"
              userType="patient"
            />
          </div>
        </div>
      )}
      
      {showChat && selectedConsultation && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">
              Chat with {selectedConsultation.doctorName}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowChat(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1">
            <ChatInterface
              consultationId={selectedConsultation.id}
              userId="1"
              userType="patient"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState(prescriptionsData);
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);
  const [showPrescriptionViewer, setShowPrescriptionViewer] = useState(false);
  
  const handleViewPrescription = (prescription: any) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionViewer(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">My Prescriptions</h1>
      
      {prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map((prescription) => (
            <Card key={prescription.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  Prescription #{prescription.id}
                </CardTitle>
                <CardDescription>
                  Issued: {prescription.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-sm mb-3">
                  <p><span className="font-medium">Doctor:</span> {prescription.doctorName}</p>
                  <p className="mt-1 text-muted-foreground line-clamp-2">
                    {prescription.medications.length} medication(s) prescribed
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => handleViewPrescription(prescription)}
                >
                  <FileText className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-medium mb-1">No prescriptions yet</h3>
          <p className="text-sm text-muted-foreground">
            Your prescriptions will appear here after your doctor issues them.
          </p>
        </div>
      )}
      
      <PrescriptionViewer
        prescription={selectedPrescription}
        isOpen={showPrescriptionViewer}
        onClose={() => setShowPrescriptionViewer(false)}
      />
    </motion.div>
  );
};

const PatientProfile = () => {
  const { toast } = useToast();
  const [patient, setPatient] = useState<Patient>(patientData);
  
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setPatient(JSON.parse(currentUser));
    }
  }, []);
  
  const handleEdit = (updatedData: UserProfileData) => {
    const updatedPatient = {
      ...patient,
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      location: updatedData.location
    };
    
    setPatient(updatedPatient);
    
    localStorage.setItem('currentUser', JSON.stringify(updatedPatient));
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">My Profile</h1>
      
      <UserProfile
        userType="patient"
        name={patient.name}
        email={patient.email}
        phone={patient.phone}
        location={patient.location}
        bio="I'm a health-conscious individual looking for quality medical consultations. I have a history of cardiovascular issues and am seeking regular checkups and advice from specialists."
        onEdit={handleEdit}
      />
    </motion.div>
  );
};

const PatientMessages = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [showChat, setShowChat] = useState(false);
  
  useEffect(() => {
    const patientConsultations = db.consultations.getByPatientId("1");
    setConsultations(patientConsultations);
  }, []);
  
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
            Stay in touch with your doctors
          </CardDescription>
        </CardHeader>
        <CardContent>
          {consultations.length > 0 ? (
            <div className="space-y-3">
              {consultations.map(consultation => (
                <div 
                  key={consultation.id} 
                  className="p-4 border rounded-md flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => {
                    setSelectedConsultation(consultation);
                    setShowChat(true);
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {consultation.doctorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{consultation.doctorName}</h4>
                      <p className="text-xs text-muted-foreground">{consultation.doctorSpecialty}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Chat
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 text-muted-foreground">No messages yet. Book a consultation to chat with a doctor.</p>
          )}
        </CardContent>
      </Card>
      
      {showChat && selectedConsultation && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium">
              Chat with {selectedConsultation.doctorName}
            </h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowChat(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-1">
            <ChatInterface
              consultationId={selectedConsultation.id}
              userId="1"
              userType="patient"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

const PatientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/patient-dashboard') {
    }
    
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(patientData));
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="patient" />
      <main>
        <Routes>
          <Route path="/" element={<PatientHome />} />
          <Route path="/consultations" element={<PatientConsultations />} />
          <Route path="/prescriptions" element={<PatientPrescriptions />} />
          <Route path="/profile" element={<PatientProfile />} />
          <Route path="/messages" element={<PatientMessages />} />
          <Route path="/book" element={<BookDoctorPage />} />
          <Route path="/book/:doctorId" element={<BookDoctorPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default PatientDashboard;
