"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "../lib/supabase";
import { Loader2 } from "lucide-react";

interface PledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchId: number;
  researchTitle: string;
  awardInstrument: string;
  principalInvestigator: string;
}

export default function PledgeModal({
  isOpen,
  onClose,
  researchId,
  researchTitle,
  awardInstrument,
  principalInvestigator,
}: PledgeModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [tasks, setTasks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const formatCurrency = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // Convert to cents then back to dollars with 2 decimal places
    const number = parseFloat(digits) / 100;

    // Format as US currency
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number || 0);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Store the raw numeric value but display formatted
    const numericValue = value.replace(/[^0-9.]/g, "");
    setAmount(numericValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.from("pledges").insert({
        research_id: researchId,
        first_name: firstName,
        last_name: lastName,
        email,
        amount: amount ? parseFloat(amount) : null,
        tasks: tasks || null,
      });

      if (error) throw error;

      setSuccess(true);
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setAmount("");
      setTasks("");
      // Close modal after 2 seconds
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting your pledge"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        {/* Header Section */}
        <div className="bg-[#012169] text-white p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl">Pledge Support</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-4 text-sm">
              <span className="bg-white/10 px-3 py-1 rounded-full">
                {awardInstrument}
              </span>
              <span>Principal Investigator: {principalInvestigator}</span>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium">
                  First Name
                </label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter first name"
                  required
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter last name"
                  required
                  className="h-12"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Pledge Amount
              </label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                value={amount ? formatCurrency(amount) : ""}
                onChange={handleAmountChange}
                placeholder="Enter amount (optional)"
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tasks" className="text-sm font-medium">
                Pledge Tasks
              </label>
              <Textarea
                id="tasks"
                value={tasks}
                onChange={(e) => setTasks(e.target.value)}
                placeholder="Describe what you will do to support this research (optional)"
                className="min-h-[150px] resize-none"
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-6"></div>

            {/* Explanatory Text */}
            <p className="text-sm text-gray-600 leading-relaxed">
              We will collect a ledger of all pledges and interested supporters.
              Then we will coordinate appropriate fundraising, confirm financial
              need, and handle escrow with Columbia Endowment and Fundraising
              officials.
            </p>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && (
              <p className="text-sm text-green-500">
                Thank you for your pledge! We will be in touch soon.
              </p>
            )}
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="h-12 px-8"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#012169] hover:bg-[#001345] h-12 px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Pledge"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
