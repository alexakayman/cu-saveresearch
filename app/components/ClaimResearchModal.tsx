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

interface ClaimResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchId: number;
  researchTitle: string;
  awardInstrument: string;
  principalInvestigator: string;
}

export default function ClaimResearchModal({
  isOpen,
  onClose,
  researchId,
  researchTitle,
  awardInstrument,
  principalInvestigator,
}: ClaimResearchModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [amendedAmount, setAmendedAmount] = useState("");
  const [asks, setAsks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isProjectCanceled, setIsProjectCanceled] = useState(false);
  const [isGrantCanceledConfirmed, setIsGrantCanceledConfirmed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await supabase.from("research_claims").insert({
        research_id: researchId,
        first_name: firstName,
        last_name: lastName,
        email,
        amended_amount: amendedAmount ? parseInt(amendedAmount) : null,
        asks: asks || null,
      });

      if (error) throw error;

      setSuccess(true);
      // Reset form
      setFirstName("");
      setLastName("");
      setEmail("");
      setAmendedAmount("");
      setAsks("");
      // Close modal after 2 seconds
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting your claim"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header Section */}
          <div className="bg-[#012169] text-white p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl">Claim Research</DialogTitle>
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
                <label htmlFor="amendedAmount" className="text-sm font-medium">
                  Amended Amount Request ($)
                </label>
                <Input
                  id="amendedAmount"
                  type="number"
                  min="0"
                  step="1000"
                  value={amendedAmount}
                  onChange={(e) => setAmendedAmount(e.target.value)}
                  placeholder="Enter amount (optional)"
                  className="h-12"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="asks" className="text-sm font-medium">
                  Additional Asks
                </label>
                <Textarea
                  id="asks"
                  value={asks}
                  onChange={(e) => setAsks(e.target.value)}
                  placeholder="Describe any additional asks or requirements (optional)"
                  className="min-h-[150px] resize-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="grantCanceled" className="text-sm font-medium">
                  <input
                    id="grantCanceled"
                    type="checkbox"
                    checked={isGrantCanceledConfirmed}
                    onChange={(e) => setIsGrantCanceledConfirmed(e.target.checked)}
                    required
                    className="mr-2"
                  />
                  I confirm that this research grant has been canceled.
                </label>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200 my-6"></div>

              {/* Explanatory Text */}
              <p className="text-sm text-gray-600 leading-relaxed">
                Your claim will be reviewed by our team. We will contact you to
                discuss the details and next steps.
              </p>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && (
                <p className="text-sm text-green-500">
                  Thank you for your claim! We will verify your claim and update
                  the posting accordingly if eligible. Email
                  alexa.kayman@columbia.edu for updates or questions.
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
                  disabled={isSubmitting || !isGrantCanceledConfirmed}
                  className="bg-[#012169] hover:bg-[#001345] h-12 px-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Claim"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
