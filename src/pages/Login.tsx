
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Lock, User, Phone, FileCheck, ShieldCheck } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [userType, setUserType] = useState("patient");
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would validate credentials and authenticate
    
    if (userType === "patient") {
      navigate("/patient-dashboard");
    } else if (userType === "doctor") {
      navigate("/doctor-dashboard");
    } else if (userType === "admin") {
      navigate("/admin-dashboard");
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "login" && userType === "admin") {
      setUserType("patient");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent p-4">
      <motion.div
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-8 text-center">
          <div className="inline-block mb-4 relative w-12 h-12 bg-primary rounded-2xl rotate-45 flex items-center justify-center shadow-md">
            <div className="absolute w-7 h-7 bg-white rounded-xl rotate-[135deg] flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-md rotate-[135deg]"></div>
            </div>
          </div>
          <h1 className="text-3xl font-medium tracking-tight mb-1">Health Connect</h1>
          <p className="text-muted-foreground">Sign in to access your account</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="glass-panel shadow-lg">
            <CardHeader className="px-6">
              <Tabs defaultValue="login" value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="px-6">
              {activeTab === "login" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-center space-x-4 mb-6">
                      <Button 
                        variant={userType === "patient" ? "default" : "outline"} 
                        onClick={() => setUserType("patient")}
                        className="w-full"
                      >
                        <User className="mr-2 h-4 w-4" /> Patient
                      </Button>
                      <Button 
                        variant={userType === "doctor" ? "default" : "outline"} 
                        onClick={() => setUserType("doctor")}
                        className="w-full"
                      >
                        <FileCheck className="mr-2 h-4 w-4" /> Doctor
                      </Button>
                      <Button 
                        variant={userType === "admin" ? "default" : "outline"} 
                        onClick={() => setUserType("admin")}
                        className="w-full"
                      >
                        <ShieldCheck className="mr-2 h-4 w-4" /> Admin
                      </Button>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="email" placeholder="Enter your email" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Password</Label>
                          <a href="#" className="text-sm text-primary hover:underline">
                            Forgot password?
                          </a>
                        </div>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="password" type="password" placeholder="••••••••" className="pl-10" />
                        </div>
                      </div>
                      <Button type="submit" className="w-full">
                        Sign In <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === "signup" && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-center space-x-4 mb-6">
                      <Button 
                        variant={userType === "patient" ? "default" : "outline"} 
                        onClick={() => setUserType("patient")}
                        className="w-full"
                      >
                        <User className="mr-2 h-4 w-4" /> Patient
                      </Button>
                      <Button 
                        variant={userType === "doctor" ? "default" : "outline"} 
                        onClick={() => setUserType("doctor")}
                        className="w-full"
                      >
                        <FileCheck className="mr-2 h-4 w-4" /> Doctor
                      </Button>
                    </div>
                    
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="full-name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="full-name" placeholder="Enter your full name" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="signup-email" placeholder="Enter your email" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="phone" placeholder="Enter your phone number" className="pl-10" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input id="signup-password" type="password" placeholder="Create a password" className="pl-10" />
                        </div>
                      </div>
                      
                      {userType === "doctor" && (
                        <div className="p-4 border border-border rounded-lg bg-secondary/50">
                          <p className="text-sm text-muted-foreground mb-3">As a doctor, you'll need to provide your medical license and credentials for verification.</p>
                          <Input type="file" className="bg-white" />
                        </div>
                      )}
                      
                      <Button type="submit" className="w-full">
                        Create Account <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="px-6 pb-6 pt-2">
              <p className="text-sm text-center text-muted-foreground w-full">
                By continuing, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
