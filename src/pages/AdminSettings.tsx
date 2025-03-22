
import { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, Lock, Save, Server, Settings, Shield, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AdminSettings = () => {
  const { toast } = useToast();
  
  const [general, setGeneral] = useState({
    platformName: "Health Connect",
    adminEmail: "admin@example.com",
    supportEmail: "support@example.com",
    description: "Online platform connecting patients with medical professionals",
  });
  
  const [security, setSecurity] = useState({
    twoFactorAuth: true,
    requireStrongPasswords: true,
    sessionTimeout: "30",
    loginAttempts: "5",
  });
  
  const [doctorVerification, setDoctorVerification] = useState({
    requireLicense: true,
    requireIdentification: true,
    requireCertifications: true,
    autoApprove: false,
  });
  
  const handleGeneralUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, update these settings in the database
    toast({
      title: "Settings updated",
      description: "General platform settings have been updated.",
    });
  };
  
  const handleSecurityUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Security settings updated",
      description: "Platform security settings have been updated.",
    });
  };
  
  const handleVerificationUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Verification requirements updated",
      description: "Doctor verification settings have been updated.",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container py-6 max-w-7xl"
    >
      <h1 className="text-3xl font-semibold mb-6">Admin Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="verification">
            <Users className="mr-2 h-4 w-4" />
            Doctor Verification
          </TabsTrigger>
          <TabsTrigger value="system">
            <Server className="mr-2 h-4 w-4" />
            System
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the platform's general settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGeneralUpdate}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label htmlFor="platform-name">Platform Name</Label>
                    <Input
                      id="platform-name"
                      value={general.platformName}
                      onChange={(e) => setGeneral({...general, platformName: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      value={general.adminEmail}
                      onChange={(e) => setGeneral({...general, adminEmail: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="support-email">Support Email</Label>
                    <Input
                      id="support-email"
                      type="email"
                      value={general.supportEmail}
                      onChange={(e) => setGeneral({...general, supportEmail: e.target.value})}
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="platform-desc">Platform Description</Label>
                    <Textarea
                      id="platform-desc"
                      value={general.description}
                      onChange={(e) => setGeneral({...general, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Configure platform security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSecurityUpdate}>
                <div className="space-y-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for all admin accounts
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => setSecurity({...security, twoFactorAuth: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Strong Passwords</h4>
                      <p className="text-sm text-muted-foreground">
                        Enforce strong password requirements for all users
                      </p>
                    </div>
                    <Switch
                      checked={security.requireStrongPasswords}
                      onCheckedChange={(checked) => setSecurity({...security, requireStrongPasswords: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity({...security, sessionTimeout: e.target.value})}
                        min="5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="login-attempts">Max Login Attempts</Label>
                      <Input
                        id="login-attempts"
                        type="number"
                        value={security.loginAttempts}
                        onChange={(e) => setSecurity({...security, loginAttempts: e.target.value})}
                        min="1"
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit">
                  <Lock className="mr-2 h-4 w-4" />
                  Update Security Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Verification Settings</CardTitle>
              <CardDescription>
                Configure requirements for doctor verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerificationUpdate}>
                <div className="space-y-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Medical License</h4>
                      <p className="text-sm text-muted-foreground">
                        Doctors must upload valid medical license
                      </p>
                    </div>
                    <Switch
                      checked={doctorVerification.requireLicense}
                      onCheckedChange={(checked) => setDoctorVerification({...doctorVerification, requireLicense: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Identification</h4>
                      <p className="text-sm text-muted-foreground">
                        Doctors must provide government-issued ID
                      </p>
                    </div>
                    <Switch
                      checked={doctorVerification.requireIdentification}
                      onCheckedChange={(checked) => setDoctorVerification({...doctorVerification, requireIdentification: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require Board Certifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Doctors must upload specialty board certifications
                      </p>
                    </div>
                    <Switch
                      checked={doctorVerification.requireCertifications}
                      onCheckedChange={(checked) => setDoctorVerification({...doctorVerification, requireCertifications: checked})}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-Approve Applications</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically approve applications with all documents
                      </p>
                    </div>
                    <Switch
                      checked={doctorVerification.autoApprove}
                      onCheckedChange={(checked) => setDoctorVerification({...doctorVerification, autoApprove: checked})}
                    />
                  </div>
                </div>
                <Button type="submit">
                  <Users className="mr-2 h-4 w-4" />
                  Update Verification Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure technical aspects of the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label>Max File Upload Size</Label>
                  <Select defaultValue="10">
                    <SelectTrigger>
                      <SelectValue placeholder="Select file size limit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 MB</SelectItem>
                      <SelectItem value="10">10 MB</SelectItem>
                      <SelectItem value="25">25 MB</SelectItem>
                      <SelectItem value="50">50 MB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Video Call Quality</Label>
                  <Select defaultValue="high">
                    <SelectTrigger>
                      <SelectValue placeholder="Select video quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (480p)</SelectItem>
                      <SelectItem value="medium">Medium (720p)</SelectItem>
                      <SelectItem value="high">High (1080p)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Database Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Run System Diagnostics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default AdminSettings;
