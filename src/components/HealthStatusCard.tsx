
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { HeartPulse, Calendar, BarChart, Activity, FileText, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface HealthMetric {
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'warning' | 'alert';
}

export interface HealthData {
  lastCheckup: string;
  nextCheckup: string;
  notes: string;
  metrics: HealthMetric[];
}

interface HealthStatusCardProps {
  healthData: HealthData;
}

const HealthStatusCard = ({ healthData }: HealthStatusCardProps) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <HeartPulse className="h-5 w-5 mr-2" />
            Health Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Checkup</span>
              <span className="text-sm font-medium">{healthData.lastCheckup}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Next Checkup</span>
              <span className="text-sm font-medium">{healthData.nextCheckup}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2"
              onClick={() => setIsDetailsOpen(true)}
            >
              See Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <HeartPulse className="h-5 w-5 mr-2" />
              Health Status Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Last Checkup</span>
              </div>
              <span className="text-sm font-medium">{healthData.lastCheckup}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">Next Checkup</span>
              </div>
              <span className="text-sm font-medium">{healthData.nextCheckup}</span>
            </div>

            <div className="pt-2">
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <BarChart className="h-4 w-4 mr-2" /> Key Health Metrics
              </h4>
              
              <div className="space-y-4">
                {healthData.metrics.map((metric, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{metric.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        metric.status === 'normal' 
                          ? 'bg-green-100 text-green-800' 
                          : metric.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {metric.value} {metric.unit}
                      </span>
                    </div>
                    <Progress 
                      value={
                        metric.status === 'normal' ? 75 :
                        metric.status === 'warning' ? 50 : 25
                      } 
                      className={`h-1.5 ${
                        metric.status === 'normal' 
                          ? 'bg-green-100' 
                          : metric.status === 'warning'
                            ? 'bg-yellow-100'
                            : 'bg-red-100'
                      }`}
                    />
                    <p className="text-xs text-muted-foreground">
                      Normal range: {metric.normalRange}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {healthData.notes && (
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <FileText className="h-4 w-4 mr-2" /> Doctor's Notes
                </h4>
                <p className="text-sm text-muted-foreground border p-3 rounded-md">
                  {healthData.notes}
                </p>
              </div>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="mt-2 w-full" 
            onClick={() => setIsDetailsOpen(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HealthStatusCard;
