
import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ChevronRight, Clock, DollarSign, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import ConsultationCard from "@/components/ConsultationCard";
import UserProfile from "@/components/UserProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Sample data
const consultations = [
  {
    id: "1",
    doctorName: "Dr. Andrew Miller",
    doctorSpecialty: "Cardiologist",
    patientName: "John Doe",
    status: "upcoming",
    date: "Oct 15, 2023",
    time: "10:00 AM",
    type: "video",
    price: 120,
  },
  {
    id: "2",
    doctorName: "Dr. Andrew Miller",
    doctorSpecialty: "Cardiologist",
    patientName: "Alice Smith",
    status: "completed",
    date: "Oct 5, 2023",
    time: "2:30 PM",
    type: "audio",
    price: 100,
  },
  {
    id: "3",
    doctorName: "Dr. Andrew Miller",
    doctorSpecialty: "Cardiologist",
    patientName: "Bob Johnson",
    status: "pending",
    date: "Oct 20, 2023",
    time: "4:15 PM",
    type: "chat",
    price: 90,
  },
];

const formatConsultations = (consults) => {
  return consults.map(consult => ({
    ...consult,
    doctorName: consult.patientName,
    doctorSpecialty: "Patient"
  }));
};

const DoctorHome = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">Welcome, Dr. Miller</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-health-600 to-health-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Next Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-lg">John Doe</p>
                <p className="text-sm opacity-90">Patient</p>
                <div className="mt-2 opacity-90 flex items-center text-sm">
                  <div className="flex items-center">
                    Oct 15, 10:00 AM
                  </div>
                </div>
              </div>
              <Button variant="ghost" className="text-white h-8 px-2" size="sm">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-health-500 rounded-full mr-2"></div>
                  <span>10:00 AM</span>
                </div>
                <span className="text-sm font-medium">John Doe</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-health-500 rounded-full mr-2"></div>
                  <span>1:30 PM</span>
                </div>
                <span className="text-sm font-medium">Alice Smith</span>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-health-500 rounded-full mr-2"></div>
                  <span>3:45 PM</span>
                </div>
                <span className="text-sm font-medium">Bob Johnson</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$1,250.00</p>
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
                  <p className="text-2xl font-semibold">24</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">+12%</p>
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
                  <p className="text-2xl font-semibold">$2,840</p>
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
                  <p className="text-2xl font-semibold">18</p>
                  <p className="text-sm text-muted-foreground">New patients</p>
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
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Appointment Requests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formatConsultations(consultations.filter(c => c.status === 'pending')).map((consult) => (
            <ConsultationCard
              key={consult.id}
              id={consult.id}
              doctorName={consult.doctorName}
              doctorSpecialty={consult.doctorSpecialty}
              status={consult.status as any}
              date={consult.date}
              time={consult.time}
              type={consult.type as any}
              price={consult.price}
            />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Upcoming Consultations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formatConsultations(consultations.filter(c => c.status === 'upcoming')).map((consult) => (
            <ConsultationCard
              key={consult.id}
              id={consult.id}
              doctorName={consult.doctorName}
              doctorSpecialty={consult.doctorSpecialty}
              status={consult.status as any}
              date={consult.date}
              time={consult.time}
              type={consult.type as any}
              price={consult.price}
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
    </motion.div>
  );
};

const DoctorAppointments = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
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
            {formatConsultations(consultations).map((consult) => (
              <ConsultationCard
                key={consult.id}
                id={consult.id}
                doctorName={consult.doctorName}
                doctorSpecialty={consult.doctorSpecialty}
                status={consult.status as any}
                date={consult.date}
                time={consult.time}
                type={consult.type as any}
                price={consult.price}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formatConsultations(consultations.filter(c => c.status === 'upcoming')).map((consult) => (
              <ConsultationCard
                key={consult.id}
                id={consult.id}
                doctorName={consult.doctorName}
                doctorSpecialty={consult.doctorSpecialty}
                status={consult.status as any}
                date={consult.date}
                time={consult.time}
                type={consult.type as any}
                price={consult.price}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formatConsultations(consultations.filter(c => c.status === 'pending')).map((consult) => (
              <ConsultationCard
                key={consult.id}
                id={consult.id}
                doctorName={consult.doctorName}
                doctorSpecialty={consult.doctorSpecialty}
                status={consult.status as any}
                date={consult.date}
                time={consult.time}
                type={consult.type as any}
                price={consult.price}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formatConsultations(consultations.filter(c => c.status === 'completed')).map((consult) => (
              <ConsultationCard
                key={consult.id}
                id={consult.id}
                doctorName={consult.doctorName}
                doctorSpecialty={consult.doctorSpecialty}
                status={consult.status as any}
                date={consult.date}
                time={consult.time}
                type={consult.type as any}
                price={consult.price}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

const DoctorProfile = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">My Profile</h1>
      
      <UserProfile
        userType="doctor"
        name="Dr. Andrew Miller"
        specialty="Cardiologist"
        email="doctor@example.com"
        phone="+1 (555) 987-6543"
        location="New York, NY"
        experience={12}
        bio="Board-certified cardiologist with over 12 years of experience in diagnosis and treatment of cardiovascular diseases. Specializing in preventive cardiology and heart failure management."
        education={[
          "MD in Cardiology, Harvard Medical School",
          "Fellowship in Interventional Cardiology, Mayo Clinic",
          "Residency in Internal Medicine, Johns Hopkins Hospital",
          "Board Certified by the American Board of Cardiology"
        ]}
        availability="Mon-Fri, 9AM-5PM"
        onEdit={() => console.log("Edit profile")}
      />
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
        </Routes>
      </main>
    </div>
  );
};

export default DoctorDashboard;
