
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CircleUser, DollarSign, BarChart3, Users, CheckCircle, XCircle, ArrowRight, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { db, initializeDatabase, Doctor, Patient, Consultation } from "@/services/database";
import AdminSettings from "./AdminSettings";

// Initialize database
initializeDatabase();

const AdminHome = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
  const [transactions, setTransactions] = useState<Consultation[]>([]);
  
  useEffect(() => {
    // Load data from database
    const allDoctors = db.doctors.getAll();
    const pending = db.doctors.getByStatus('pending');
    const allPatients = db.patients.getAll();
    const allConsultations = db.consultations.getAll();
    
    setDoctors(allDoctors);
    setPendingDoctors(pending);
    setPatients(allPatients);
    setConsultations(allConsultations);
    setTransactions(allConsultations.slice(0, 4)); // Just use first 4 consultations for demo
  }, []);
  
  const getTotalRevenue = () => {
    return consultations.reduce((sum, c) => sum + c.price, 0).toFixed(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-8 w-8 text-health-500 mr-3" />
              <div>
                <p className="text-2xl font-semibold">{doctors.length + patients.length}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Doctors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CircleUser className="h-8 w-8 text-health-500 mr-3" />
              <div>
                <p className="text-2xl font-semibold">{doctors.length}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600">+5%</span> from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-health-500 mr-3" />
              <div>
                <p className="text-2xl font-semibold">${getTotalRevenue()}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600">+18%</span> from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Consultations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-health-500 mr-3" />
              <div>
                <p className="text-2xl font-semibold">{consultations.length}</p>
                <p className="text-sm text-muted-foreground">
                  <span className="text-green-600">+24%</span> from last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Doctor Approvals</CardTitle>
            <CardDescription>Review and approve new doctor applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDoctors.length > 0 ? (
                    pendingDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {doctor.name}
                          </div>
                        </TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>MM/DD/YYYY</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <XCircle className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No pending doctor applications
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Applications
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Monitor payment activity on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.patientName}</TableCell>
                      <TableCell>{transaction.doctorName}</TableCell>
                      <TableCell>${transaction.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm">
                View All Transactions
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Platform Analytics</CardTitle>
            <CardDescription>Monitor platform performance and user engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border border-dashed rounded-lg">
              <p className="text-muted-foreground">Analytics charts will be implemented in the next version</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

const AdminDoctors = () => {
  const { toast } = useToast();
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([]);
  const [pendingDoctors, setPendingDoctors] = useState<Doctor[]>([]);
  const [approvedDoctors, setApprovedDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Load data from database
    const doctors = db.doctors.getAll();
    const pending = db.doctors.getByStatus('pending');
    const approved = db.doctors.getByStatus('approved');
    
    setAllDoctors(doctors);
    setPendingDoctors(pending);
    setApprovedDoctors(approved);
  }, []);
  
  const handleApproveDoctor = (doctorId: string) => {
    db.doctors.update(doctorId, { status: 'approved' });
    
    // Refresh data
    const doctors = db.doctors.getAll();
    const pending = db.doctors.getByStatus('pending');
    const approved = db.doctors.getByStatus('approved');
    
    setAllDoctors(doctors);
    setPendingDoctors(pending);
    setApprovedDoctors(approved);
    
    toast({
      title: "Doctor approved",
      description: "The doctor has been approved and can now log in.",
    });
  };
  
  const handleRejectDoctor = (doctorId: string) => {
    db.doctors.update(doctorId, { status: 'rejected' });
    
    // Refresh data
    const doctors = db.doctors.getAll();
    const pending = db.doctors.getByStatus('pending');
    const approved = db.doctors.getByStatus('approved');
    
    setAllDoctors(doctors);
    setPendingDoctors(pending);
    setApprovedDoctors(approved);
    
    toast({
      title: "Doctor rejected",
      description: "The doctor application has been rejected.",
    });
  };
  
  const filteredDoctors = (doctors: Doctor[]) => {
    if (!searchTerm) return doctors;
    return doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Manage Doctors</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search doctors..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Doctors</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors(allDoctors).length > 0 ? (
                    filteredDoctors(allDoctors).map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {doctor.name}
                          </div>
                        </TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={
                              doctor.status === 'approved'
                                ? "bg-green-100 text-green-800"
                                : doctor.status === 'pending'
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {doctor.status.charAt(0).toUpperCase() + doctor.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{doctor.location}</TableCell>
                        <TableCell>${doctor.price}/hr</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No doctors found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="pending">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors(pendingDoctors).length > 0 ? (
                    filteredDoctors(pendingDoctors).map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {doctor.name}
                          </div>
                        </TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>{doctor.location}</TableCell>
                        <TableCell>
                          <Button variant="link" size="sm" className="p-0 h-auto">
                            View documents
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600"
                              onClick={() => handleApproveDoctor(doctor.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => handleRejectDoctor(doctor.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        No pending doctor applications
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="approved">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Specialty</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors(approvedDoctors).length > 0 ? (
                    filteredDoctors(approvedDoctors).map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {doctor.name}
                          </div>
                        </TableCell>
                        <TableCell>{doctor.specialty}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                        <TableCell>{doctor.location}</TableCell>
                        <TableCell>${doctor.price}/hr</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No approved doctors found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

const AdminPatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const allPatients = db.patients.getAll();
    setPatients(allPatients);
  }, []);
  
  const filteredPatients = () => {
    if (!searchTerm) return patients;
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Manage Patients</h1>
        <div className="relative w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search patients..." 
            className="pl-9" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Consultations</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients().length > 0 ? (
                filteredPatients().map((patient) => {
                  const patientConsultations = db.consultations.getByPatientId(patient.id);
                  
                  return (
                    <TableRow key={patient.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {patient.name}
                        </div>
                      </TableCell>
                      <TableCell>{patient.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={
                            patient.status === 'active'
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(patient.joinedDate).toLocaleDateString()}</TableCell>
                      <TableCell>{patientConsultations.length}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">View</Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No patients found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/admin-dashboard') {
      // If we're at the root of the dashboard, don't redirect
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar userType="admin" />
      <main>
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/doctors" element={<AdminDoctors />} />
          <Route path="/patients" element={<AdminPatients />} />
          <Route path="/settings" element={<AdminSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
