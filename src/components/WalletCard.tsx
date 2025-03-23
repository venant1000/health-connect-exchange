
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Wallet, Plus, History, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import BankDetailsForm from "./BankDetailsForm";

interface WalletCardProps {
  balance: number;
  onAddFunds: (amount: number) => void;
  onViewHistory: () => void;
}

const WalletCard = ({ balance, onAddFunds, onViewHistory }: WalletCardProps) => {
  const { toast } = useToast();
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  
  const handleAddFunds = (amount: number) => {
    onAddFunds(amount);
    setIsAddFundsOpen(false);
    
    toast({
      title: "Funds added",
      description: `$${amount.toFixed(2)} has been added to your wallet.`,
    });
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Wallet className="h-5 w-5 mr-2" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold">${balance.toFixed(2)}</p>
        <div className="flex mt-3">
          <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mr-2">
                <Plus className="h-4 w-4 mr-1" /> Add Funds
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add funds to wallet</DialogTitle>
              </DialogHeader>
              <BankDetailsForm 
                onSubmit={handleAddFunds}
                onCancel={() => setIsAddFundsOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="sm" onClick={onViewHistory}>
            <History className="h-4 w-4 mr-1" /> History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletCard;
