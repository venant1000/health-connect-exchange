
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreditCard, CheckCircle } from 'lucide-react';

const bankDetailsSchema = z.object({
  accountName: z.string().min(2, "Account name is required"),
  accountNumber: z.string().min(8, "Account number must be at least 8 digits"),
  routingNumber: z.string().min(9, "Routing number must be 9 digits"),
  bankName: z.string().min(2, "Bank name is required"),
  amount: z.string().refine(
    (value) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }, 
    { message: "Amount must be greater than 0" }
  )
});

type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;

interface BankDetailsFormProps {
  onSubmit: (amount: number) => void;
  onCancel: () => void;
}

const BankDetailsForm = ({ onSubmit, onCancel }: BankDetailsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<BankDetailsFormValues>({
    resolver: zodResolver(bankDetailsSchema),
    defaultValues: {
      accountName: '',
      accountNumber: '',
      routingNumber: '',
      bankName: '',
      amount: '',
    },
  });

  const handleSubmit = (values: BankDetailsFormValues) => {
    setIsSubmitting(true);
    
    // Simulate processing bank transfer
    setTimeout(() => {
      setIsSubmitting(false);
      onSubmit(parseFloat(values.amount));
    }, 1500);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Holder Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="accountNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Number</FormLabel>
              <FormControl>
                <Input placeholder="12345678" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="routingNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Routing Number</FormLabel>
              <FormControl>
                <Input placeholder="123456789" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank Name</FormLabel>
              <FormControl>
                <Input placeholder="Chase" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to Transfer</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input className="pl-7" placeholder="0.00" type="number" step="0.01" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between pt-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Add Funds
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BankDetailsForm;
