
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  notes?: string;
}

interface PrescriptionViewerProps {
  prescription: Prescription | null;
  isOpen: boolean;
  onClose: () => void;
}

const PrescriptionViewer = ({
  prescription,
  isOpen,
  onClose
}: PrescriptionViewerProps) => {
  if (!prescription) return null;

  const handleDownload = () => {
    const doc = new jsPDF();
    
    // Add clinic logo (placeholder)
    doc.setFontSize(20);
    doc.setTextColor(41, 98, 255);
    doc.text("HealthConnect Clinic", 105, 20, { align: 'center' });
    
    // Add prescription details
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    doc.text(`Date: ${prescription.date}`, 20, 40);
    doc.text(`Patient: ${prescription.patientName}`, 20, 50);
    doc.text(`Doctor: ${prescription.doctorName}`, 20, 60);
    
    // Add medications table
    const tableColumn = ["Medication", "Dosage", "Frequency", "Duration"];
    const tableRows = prescription.medications.map(med => [
      med.name,
      med.dosage,
      med.frequency,
      med.duration
    ]);
    
    // @ts-ignore (jspdf-autotable typing issue)
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 70,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 98, 255] }
    });
    
    // Add notes if any
    if (prescription.notes) {
      // @ts-ignore (getting the final Y position after autotable)
      const finalY = doc.lastAutoTable.finalY || 120;
      doc.text("Notes:", 20, finalY + 10);
      doc.setFontSize(10);
      
      // Wrap text for notes
      const splitNotes = doc.splitTextToSize(prescription.notes, 170);
      doc.text(splitNotes, 20, finalY + 20);
    }
    
    // Add signature
    doc.setFontSize(10);
    doc.text("Doctor's Signature:", 130, 220);
    doc.setFontSize(11);
    doc.setTextColor(41, 98, 255);
    doc.text(prescription.doctorName, 130, 230);
    
    // Save the PDF
    doc.save(`prescription_${prescription.id}.pdf`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Prescription Details</DialogTitle>
        </DialogHeader>
        
        <Card className="mt-4 border-2 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-primary">HealthConnect Clinic</h3>
                <p className="text-sm text-muted-foreground">123 Medical Drive, Healthcare City</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Date: {prescription.date}</p>
                <p className="text-sm text-muted-foreground">Prescription #{prescription.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Patient</h4>
                <p className="font-medium">{prescription.patientName}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Doctor</h4>
                <p className="font-medium">{prescription.doctorName}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Medications</h4>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Medication</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Dosage</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Frequency</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {prescription.medications.map((medication, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">{medication.name}</td>
                        <td className="px-4 py-2 text-sm">{medication.dosage}</td>
                        <td className="px-4 py-2 text-sm">{medication.frequency}</td>
                        <td className="px-4 py-2 text-sm">{medication.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {prescription.notes && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Notes</h4>
                <div className="p-3 border rounded-md bg-background text-sm">
                  {prescription.notes}
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-end">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Doctor's Signature</h4>
                <p className="font-medium text-primary">{prescription.doctorName}</p>
              </div>
              <Button variant="default" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionViewer;
