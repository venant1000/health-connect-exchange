
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDown, ArrowUp, Calendar, DollarSign, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface Transaction {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  date: string;
  description: string;
}

interface WalletHistoryProps {
  transactions: Transaction[];
  open: boolean;
  onClose: () => void;
}

const WalletHistory = ({ transactions, open, onClose }: WalletHistoryProps) => {
  const credits = transactions.filter(t => t.type === 'credit');
  const debits = transactions.filter(t => t.type === 'debit');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Transaction History
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="all" className="mt-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="credits">Added</TabsTrigger>
            <TabsTrigger value="debits">Spent</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <TransactionList transactions={transactions} />
          </TabsContent>
          
          <TabsContent value="credits">
            <TransactionList transactions={credits} />
          </TabsContent>
          
          <TabsContent value="debits">
            <TransactionList transactions={debits} />
          </TabsContent>
        </Tabs>
        
        <Button 
          variant="outline" 
          className="mt-4 w-full" 
          onClick={onClose}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

const TransactionList = ({ transactions }: { transactions: Transaction[] }) => {
  if (transactions.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        No transactions found
      </div>
    );
  }
  
  return (
    <div className="space-y-3 mt-3 max-h-80 overflow-y-auto pr-1">
      {transactions.map(transaction => (
        <div 
          key={transaction.id} 
          className="p-3 border rounded-md flex items-start justify-between"
        >
          <div className="flex items-start">
            <div className={`rounded-full p-2 mr-3 ${
              transaction.type === 'credit' 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              {transaction.type === 'credit' 
                ? <ArrowDown className="h-4 w-4" /> 
                : <ArrowUp className="h-4 w-4" />
              }
            </div>
            <div>
              <p className="font-medium text-sm">{transaction.description}</p>
              <p className="text-muted-foreground text-xs flex items-center mt-1">
                <Calendar className="h-3 w-3 mr-1" /> 
                {transaction.date}
              </p>
            </div>
          </div>
          <span className={`font-medium ${
            transaction.type === 'credit' 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {transaction.type === 'credit' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default WalletHistory;
