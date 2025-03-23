
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Wallet, Plus, History, CreditCard, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WalletCardProps {
  balance: number;
  onAddFunds: (amount: number) => void;
  onViewHistory: () => void;
}

const WalletCard = ({ balance, onAddFunds, onViewHistory }: WalletCardProps) => {
  const { toast } = useToast();
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");

  const handleAddFunds = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount.",
        variant: "destructive",
      });
      return;
    }

    onAddFunds(numAmount);
    setAmount("");
    setIsAddFundsOpen(false);
    
    toast({
      title: "Funds added",
      description: `$${numAmount.toFixed(2)} has been added to your wallet.`,
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
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="amount" className="text-sm font-medium">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="amount"
                      placeholder="0.00"
                      className="pl-7"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="payment-method" className="text-sm font-medium">
                    Payment Method
                  </label>
                  <div className="p-3 border rounded-md flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-muted-foreground" />
                    <span>•••• •••• •••• 4242</span>
                    <CheckCircle className="h-4 w-4 ml-auto text-green-500" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddFundsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddFunds}>
                  Add Funds
                </Button>
              </DialogFooter>
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
