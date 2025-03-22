import { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Plus, Filter, MapPin, ArrowRight, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import DoctorCard from "@/components/DoctorCard";
import ConsultationCard from "@/components/ConsultationCard";
import UserProfile from "@/components/UserProfile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookDoctorPage from "./BookDoctorPage";

const doctors = [
  {
    id: "1",
    name: "Dr. Emma Wilson",
    specialty: "Cardiologist",
    rating: 4.8,
    experience: 12,
    location: "New York",
    price: 120,
    availability: "Mon-Fri",
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialty: "Neurologist",
    rating: 4.5,
    experience: 8,
    location: "San Francisco",
    price: 100,
    availability: "Mon, Wed, Fri",
  },
  {
    id: "3",
    name: "Dr. Lisa Johnson",
    specialty: "Dermatologist",
    rating: 4.9,
    experience: 15,
    location: "Chicago",
    price: 140,
    availability: "Tue-Sat",
  },
];

const consultations = [
  {
    id: "1",
    doctorName: "Dr. Emma Wilson",
    doctorSpecialty: "Cardiologist",
    status: "upcoming",
    date: "Oct 15, 2023",
    time: "10:00 AM",
    type: "video",
    price: 120,
  },
  {
    id: "2",
    doctorName: "Dr. Michael Chen",
    doctorSpecialty: "Neurologist",
    status: "completed",
    date: "Oct 5, 2023",
    time: "2:30 PM",
    type: "audio",
    price: 100,
  },
  {
    id: "3",
    doctorName: "Dr. Lisa Johnson",
    doctorSpecialty: "Dermatologist",
    status: "pending",
    date: "Oct 20, 2023",
    time: "4:15 PM",
    type: "chat",
    price: 90,
  },
];

const PatientHome = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">Welcome, John</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-health-600 to-health-700 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Next Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-lg">Dr. Emma Wilson</p>
                <p className="text-sm opacity-90">Cardiologist</p>
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
            <CardTitle className="text-lg">Wallet Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$350.00</p>
            <div className="flex mt-3">
              <Button variant="outline" size="sm" className="mr-2">Add Funds</Button>
              <Button variant="ghost" size="sm">History</Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Last Checkup</span>
                <span className="text-sm font-medium">Sep 23, 2023</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Next Checkup</span>
                <span className="text-sm font-medium">Dec 23, 2023</span>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2">See Details</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h2 className="text-2xl font-semibold">Find Doctors</h2>
          <div className="flex items-center mt-3 md:mt-0">
            <div className="relative w-64 mr-2">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or specialty" className="pl-9" />
            </div>
            <Button variant="outline" size="icon" className="mr-2">
              <Filter className="h-4 w-4" />
            </Button>
            <Button onClick={() => navigate("/patient-dashboard/book")}>
              <Plus className="h-4 w-4 mr-2" />
              Request Consultation
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              id={doctor.id}
              name={doctor.name}
              specialty={doctor.specialty}
              rating={doctor.rating}
              experience={doctor.experience}
              location={doctor.location}
              price={doctor.price}
              availability={doctor.availability}
              onClick={() => navigate(`/patient-dashboard/book/${doctor.id}`)}
            />
          ))}
        </div>
        <div className="mt-4 text-center">
          <Button variant="outline" className="mt-2">
            View All Doctors
            <ChevronRight className="h-4 w-4 ml-1" />
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
              {consultations
                .filter((consult) => consult.status === "pending")
                .map((consult) => (
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
              {consultations
                .filter((consult) => consult.status === "completed")
                .map((consult) => (
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
      </div>
    </motion.div>
  );
};

const PatientConsultations = () => {
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
            {consultations
              .filter((consult) => consult.status === "upcoming")
              .map((consult) => (
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
            {consultations
              .filter((consult) => consult.status === "pending")
              .map((consult) => (
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
            {consultations
              .filter((consult) => consult.status === "completed")
              .map((consult) => (
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

const PatientProfile = () => {
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
        name="John Doe"
        email="john@example.com"
        phone="+1 (555) 123-4567"
        location="New York, NY"
        bio="I'm a health-conscious individual looking for quality medical consultations. I have a history of cardiovascular issues and am seeking regular checkups and advice from specialists."
        onEdit={() => console.log("Edit profile")}
      />
    </motion.div>
  );
};

const PatientMessages = () => {
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
          <p className="text-center py-12 text-muted-foreground">Message feature will be implemented in the next version.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const PatientDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/patient-dashboard') {
      // If we're at the root of the dashboard, don't redirect
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="patient" />
      <main>
        <Routes>
          <Route path="/" element={<PatientHome />} />
          <Route path="/consultations" element={<PatientConsultations />} />
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
