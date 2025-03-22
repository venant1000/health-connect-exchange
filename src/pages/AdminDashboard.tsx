
import { useEffect } from "react";
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

// Sample data
const pendingDoctors = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialty: "Neurologist",
    email: "sarah.johnson@example.com",
    applicationDate: "2023-10-01",
    documents: ["medical_license.pdf", "certification.pdf", "resume.pdf"],
  },
  {
    id: "2",
    name: "Dr. Michael Brown",
    specialty: "Dermatologist",
    email: "michael.brown@example.com",
    applicationDate: "2023-10-05",
    documents: ["license.pdf", "board_certification.pdf", "cv.pdf"],
  },
  {
    id: "3",
    name: "Dr. Jessica Martinez",
    specialty: "Psychiatrist",
    email: "jessica.martinez@example.com",
    applicationDate: "2023-10-10",
    documents: ["medical_license.pdf", "psychiatry_cert.pdf", "resume.pdf"],
  },
];

const recentTransactions = [
  {
    id: "1",
    patient: "John Doe",
    doctor: "Dr. Emma Wilson",
    amount: 120,
    date: "2023-10-15",
    status: "completed",
  },
  {
    id: "2",
    patient: "Alice Smith",
    doctor: "Dr. Michael Chen",
    amount: 100,
    date: "2023-10-14",
    status: "completed",
  },
  {
    id: "3",
    patient: "Bob Johnson",
    doctor: "Dr. Lisa Johnson",
    amount: 150,
    date: "2023-10-13",
    status: "pending",
  },
  {
    id: "4",
    patient: "Emma Davis",
    doctor: "Dr. Andrew Miller",
    amount: 135,
    date: "2023-10-12",
    status: "refunded",
  },
];

const AdminHome = () => {
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
                <p className="text-2xl font-semibold">1,248</p>
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
                <p className="text-2xl font-semibold">247</p>
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
                <p className="text-2xl font-semibold">$56,429</p>
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
                <p className="text-2xl font-semibold">842</p>
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
                  {pendingDoctors.map((doctor) => (
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
                      <TableCell>{new Date(doctor.applicationDate).toLocaleDateString()}</TableCell>
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
                  ))}
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
                  {recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.patient}</TableCell>
                      <TableCell>{transaction.doctor}</TableCell>
                      <TableCell>${transaction.amount}</TableCell>
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
          <Input placeholder="Search doctors..." className="pl-9" />
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
                    <TableHead>Joined</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>EM</AvatarFallback>
                        </Avatar>
                        Dr. Emma Wilson
                      </div>
                    </TableCell>
                    <TableCell>Cardiologist</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    </TableCell>
                    <TableCell>Jan 15, 2023</TableCell>
                    <TableCell>42</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>MC</AvatarFallback>
                        </Avatar>
                        Dr. Michael Chen
                      </div>
                    </TableCell>
                    <TableCell>Neurologist</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    </TableCell>
                    <TableCell>Mar 22, 2023</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  {pendingDoctors.map((doctor) => (
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
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>
                      </TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>0</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Review</Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableHead>Applied On</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingDoctors.map((doctor) => (
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
                      <TableCell>{new Date(doctor.applicationDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="link" size="sm" className="p-0 h-auto">
                          {doctor.documents.length} documents
                        </Button>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="text-green-600">
                            Approve
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableHead>Joined</TableHead>
                    <TableHead>Patients</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>EM</AvatarFallback>
                        </Avatar>
                        Dr. Emma Wilson
                      </div>
                    </TableCell>
                    <TableCell>Cardiologist</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    </TableCell>
                    <TableCell>Jan 15, 2023</TableCell>
                    <TableCell>42</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarFallback>MC</AvatarFallback>
                        </Avatar>
                        Dr. Michael Chen
                      </div>
                    </TableCell>
                    <TableCell>Neurologist</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                    </TableCell>
                    <TableCell>Mar 22, 2023</TableCell>
                    <TableCell>28</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
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
          <Input placeholder="Search patients..." className="pl-9" />
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
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    John Doe
                  </div>
                </TableCell>
                <TableCell>john@example.com</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                </TableCell>
                <TableCell>Feb 12, 2023</TableCell>
                <TableCell>8</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    Alice Smith
                  </div>
                </TableCell>
                <TableCell>alice@example.com</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                </TableCell>
                <TableCell>Jan 5, 2023</TableCell>
                <TableCell>12</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>BJ</AvatarFallback>
                    </Avatar>
                    Bob Johnson
                  </div>
                </TableCell>
                <TableCell>bob@example.com</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>
                </TableCell>
                <TableCell>Mar 18, 2023</TableCell>
                <TableCell>5</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarFallback>ED</AvatarFallback>
                    </Avatar>
                    Emma Davis
                  </div>
                </TableCell>
                <TableCell>emma@example.com</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Inactive</Badge>
                </TableCell>
                <TableCell>Apr 22, 2023</TableCell>
                <TableCell>2</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
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
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
