
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect to login after 3 seconds
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-accent">
      <motion.div 
        className="text-center max-w-md px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-6 flex justify-center"
        >
          <div className="relative w-24 h-24 bg-primary rounded-2xl rotate-45 flex items-center justify-center shadow-lg">
            <div className="absolute w-14 h-14 bg-white rounded-xl rotate-[135deg] flex items-center justify-center">
              <div className="w-6 h-6 bg-primary rounded-md rotate-[135deg]"></div>
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-4xl font-semibold tracking-tight mb-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Health Connect
        </motion.h1>
        
        <motion.p 
          className="text-muted-foreground mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Your health, your choice — Consult with doctors anytime, anywhere
        </motion.p>
        
        <motion.div 
          className="flex justify-center space-x-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse-subtle"></div>
          <div className="w-2 h-2 bg-primary/70 rounded-full animate-pulse-subtle" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse-subtle" style={{ animationDelay: "0.4s" }}></div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
