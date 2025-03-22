
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Calendar,
  CircleUser,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  X,
} from "lucide-react";

interface NavbarProps {
  userType: 'patient' | 'doctor' | 'admin';
}

const Navbar = ({ userType }: NavbarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavItems = () => {
    switch (userType) {
      case 'patient':
        return [
          { label: 'Home', icon: <Home className="h-4 w-4 mr-2" />, path: '/patient-dashboard' },
          { label: 'Consultations', icon: <Calendar className="h-4 w-4 mr-2" />, path: '/patient-dashboard/consultations' },
          { label: 'Messages', icon: <MessageSquare className="h-4 w-4 mr-2" />, path: '/patient-dashboard/messages' },
        ];
      case 'doctor':
        return [
          { label: 'Home', icon: <Home className="h-4 w-4 mr-2" />, path: '/doctor-dashboard' },
          { label: 'Appointments', icon: <Calendar className="h-4 w-4 mr-2" />, path: '/doctor-dashboard/appointments' },
          { label: 'Messages', icon: <MessageSquare className="h-4 w-4 mr-2" />, path: '/doctor-dashboard/messages' },
        ];
      case 'admin':
        return [
          { label: 'Dashboard', icon: <Home className="h-4 w-4 mr-2" />, path: '/admin-dashboard' },
          { label: 'Doctors', icon: <CircleUser className="h-4 w-4 mr-2" />, path: '/admin-dashboard/doctors' },
          { label: 'Patients', icon: <CircleUser className="h-4 w-4 mr-2" />, path: '/admin-dashboard/patients' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const userName = userType === 'patient' ? 'John Doe' : userType === 'doctor' ? 'Dr. Smith' : 'Admin';
  const userEmail = userType === 'patient' ? 'john@example.com' : userType === 'doctor' ? 'doctor@example.com' : 'admin@example.com';

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="relative w-8 h-8 bg-primary rounded-lg rotate-45 flex items-center justify-center">
              <div className="absolute w-4 h-4 bg-white rounded-md rotate-[135deg] flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-sm rotate-[135deg]"></div>
              </div>
            </div>
            <span className="font-medium text-lg hidden md:inline-block">Health Connect</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-5">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? "nav-item-active" : ""
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.label}
                </div>
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
              3
            </span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => navigate(`/${userType}-dashboard/profile`)}
                className="cursor-pointer"
              >
                <CircleUser className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate(`/${userType}-dashboard/settings`)}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm md:hidden"
          >
            <div className="container flex h-16 items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative w-8 h-8 bg-primary rounded-lg rotate-45 flex items-center justify-center">
                  <div className="absolute w-4 h-4 bg-white rounded-md rotate-[135deg] flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-sm rotate-[135deg]"></div>
                  </div>
                </div>
                <span className="font-medium text-lg">Health Connect</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="container flex flex-col gap-6 p-4">
              <div className="flex items-center gap-4 py-4 border-b">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {userName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{userName}</p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    {userEmail}
                  </p>
                </div>
              </div>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`flex items-center py-3 px-4 rounded-md ${
                      location.pathname === item.path
                        ? "bg-accent font-medium text-primary"
                        : "text-foreground hover:bg-accent"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {item.icon}
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-auto">
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
