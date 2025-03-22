
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface PrescriptionFormProps {
  patientName: string;
  patientId: string;
  consultationId: string;
  onComplete: (prescriptionData: any) => void;
  onCancel: () => void;
}

const PrescriptionForm = ({
  patientName,
  patientId,
  consultationId,
  onComplete,
  onCancel,
}: PrescriptionFormProps) => {
  const { toast } = useToast();
  const [signature, setSignature] = useState<string>("");
  const [prescriptionData, setPrescriptionData] = useState({
    medications: [{ name: "", dosage: "", instructions: "" }],
    notes: "",
    diagnosis: "",
    followUpDate: "",
  });

  const addMedication = () => {
    setPrescriptionData({
      ...prescriptionData,
      medications: [
        ...prescriptionData.medications,
        { name: "", dosage: "", instructions: "" }
      ]
    });
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updatedMedications = [...prescriptionData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    setPrescriptionData({
      ...prescriptionData,
      medications: updatedMedications
    });
  };

  const removeMedication = (index: number) => {
    if (prescriptionData.medications.length > 1) {
      const updatedMedications = [...prescriptionData.medications];
      updatedMedications.splice(index, 1);
      setPrescriptionData({
        ...prescriptionData,
        medications: updatedMedications
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!signature) {
      toast({
        title: "Signature required",
        description: "Please add your signature to complete the prescription",
        variant: "destructive",
      });
      return;
    }

    const completeData = {
      ...prescriptionData,
      patientName,
      patientId,
      consultationId,
      signature,
      issuedDate: new Date().toISOString(),
    };

    // Save to local database
    const existingPrescriptions = JSON.parse(localStorage.getItem('prescriptions') || '[]');
    localStorage.setItem('prescriptions', JSON.stringify([...existingPrescriptions, completeData]));
    
    onComplete(completeData);
    
    toast({
      title: "Prescription issued",
      description: "The prescription has been successfully issued to the patient",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Issue Prescription</h3>
              <p className="text-sm text-muted-foreground">
                For patient: <span className="font-medium">{patientName}</span>
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea
                  id="diagnosis"
                  value={prescriptionData.diagnosis}
                  onChange={(e) => setPrescriptionData({...prescriptionData, diagnosis: e.target.value})}
                  placeholder="Patient diagnosis"
                  required
                />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Medications</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={addMedication}
                  >
                    Add Medication
                  </Button>
                </div>
                
                {prescriptionData.medications.map((med, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 mb-3 p-3 border rounded-md bg-background">
                    <div className="col-span-12 md:col-span-4">
                      <Label htmlFor={`med-name-${index}`}>Medication</Label>
                      <Input
                        id={`med-name-${index}`}
                        value={med.name}
                        onChange={(e) => updateMedication(index, 'name', e.target.value)}
                        placeholder="Medication name"
                        required
                      />
                    </div>
                    <div className="col-span-12 md:col-span-3">
                      <Label htmlFor={`med-dosage-${index}`}>Dosage</Label>
                      <Input
                        id={`med-dosage-${index}`}
                        value={med.dosage}
                        onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                        placeholder="e.g., 500mg"
                        required
                      />
                    </div>
                    <div className="col-span-12 md:col-span-4">
                      <Label htmlFor={`med-instructions-${index}`}>Instructions</Label>
                      <Input
                        id={`med-instructions-${index}`}
                        value={med.instructions}
                        onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                        placeholder="e.g., Twice a day after meals"
                        required
                      />
                    </div>
                    <div className="col-span-12 md:col-span-1 flex items-end justify-center">
                      {prescriptionData.medications.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive h-10"
                          onClick={() => removeMedication(index)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={prescriptionData.notes}
                  onChange={(e) => setPrescriptionData({...prescriptionData, notes: e.target.value})}
                  placeholder="Any additional instructions or recommendations"
                />
              </div>
              
              <div>
                <Label htmlFor="followup">Follow-up Date (if needed)</Label>
                <Input
                  id="followup"
                  type="date"
                  value={prescriptionData.followUpDate}
                  onChange={(e) => setPrescriptionData({...prescriptionData, followUpDate: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="signature">Doctor's Signature</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="signature"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your name to sign"
                    required
                  />
                  <PenLine className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">
                <Check className="mr-2 h-4 w-4" />
                Issue Prescription
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default PrescriptionForm;
