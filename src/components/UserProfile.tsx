
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, Calendar, Edit, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserProfileProps {
  userType: 'patient' | 'doctor' | 'admin';
  name: string;
  email: string;
  phone: string;
  location: string;
  avatar?: string;
  specialty?: string;
  experience?: number;
  bio?: string;
  education?: string[];
  availability?: string;
  onEdit?: (updatedData: UserProfileData) => void;
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio?: string;
}

const UserProfile = ({
  userType,
  name,
  email,
  phone,
  location,
  avatar,
  specialty,
  experience,
  bio,
  education,
  availability,
  onEdit,
}: UserProfileProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfileData>({
    name,
    email,
    phone,
    location,
    bio: bio || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (onEdit) {
      onEdit(formData);
    }
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleCancel = () => {
    setFormData({
      name,
      email,
      phone,
      location,
      bio: bio || "",
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-20 w-20 border">
                <AvatarImage src={avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {formData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {isEditing ? (
                    <Input 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-xl font-semibold h-auto py-1"
                    />
                  ) : (
                    <h2 className="text-2xl font-semibold">{formData.name}</h2>
                  )}
                  {userType === 'doctor' && (
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {specialty}
                    </Badge>
                  )}
                </div>
                {userType === 'doctor' && experience && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {experience} years of experience
                  </p>
                )}
                {userType === 'patient' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Patient
                  </p>
                )}
                {userType === 'admin' && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Administrator
                  </p>
                )}
              </div>
            </div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="default" size="sm" onClick={handleSave}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formData.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{formData.location}</span>
                  </div>
                </>
              )}
              {userType === 'doctor' && availability && !isEditing && (
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Available {availability}</span>
                </div>
              )}
            </div>

            {(bio || isEditing) && (
              <div>
                <h3 className="text-lg font-medium mb-2">About</h3>
                {isEditing ? (
                  <Input
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                ) : (
                  <p className="text-muted-foreground">{formData.bio}</p>
                )}
              </div>
            )}

            {userType === 'doctor' && education && education.length > 0 && !isEditing && (
              <div>
                <h3 className="text-lg font-medium mb-2">Education & Qualifications</h3>
                <ul className="space-y-2">
                  {education.map((edu, index) => (
                    <li key={index} className="flex items-start">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 mr-2"></div>
                      <span className="text-muted-foreground">{edu}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {userType === 'doctor' && !isEditing && (
              <div>
                <h3 className="text-lg font-medium mb-2">Availability</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div 
                      key={day} 
                      className={`py-2 px-3 rounded-md border text-center ${
                        i < 5 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                      }`}
                    >
                      <div className="font-medium">{day}</div>
                      <div className="text-xs mt-1">{i < 5 ? '9:00 AM - 5:00 PM' : 'Unavailable'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UserProfile;
