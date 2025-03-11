"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "../lib/supabase";
import { Loader2 } from "lucide-react";

export default function AddResearchForm() {
  const [formData, setFormData] = useState({
    award_number: "",
    title: "",
    abstract: "",
    nsf_organization: "",
    programs: "",
    start_date: "",
    last_amendment_date: "",
    principal_investigator: "",
    state: "",
    organization: "",
    award_instrument: "",
    program_manager: "",
    end_date: "",
    awarded_amount_to_date: "",
    co_pi_names: "",
    pi_email_address: "",
    organization_street: "",
    organization_city: "",
    organization_state: "",
    organization_zip: "",
    organization_phone: "",
    nsf_directorate: "",
    program_element_codes: "",
    program_reference_codes: "",
    arra_amount: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Convert numeric fields
      const numericFormData = {
        ...formData,
        awarded_amount_to_date: formData.awarded_amount_to_date
          ? parseFloat(formData.awarded_amount_to_date)
          : null,
        arra_amount: formData.arra_amount
          ? parseFloat(formData.arra_amount)
          : null,
      };

      const { error } = await supabase
        .from("research_projects")
        .insert([numericFormData]);

      if (error) throw error;

      setSuccess(true);
      // Reset form
      setFormData({
        award_number: "",
        title: "",
        abstract: "",
        nsf_organization: "",
        programs: "",
        start_date: "",
        last_amendment_date: "",
        principal_investigator: "",
        state: "",
        organization: "",
        award_instrument: "",
        program_manager: "",
        end_date: "",
        awarded_amount_to_date: "",
        co_pi_names: "",
        pi_email_address: "",
        organization_street: "",
        organization_city: "",
        organization_state: "",
        organization_zip: "",
        organization_phone: "",
        nsf_directorate: "",
        program_element_codes: "",
        program_reference_codes: "",
        arra_amount: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while submitting the research project"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-2">
          <label htmlFor="award_number" className="text-sm font-medium">
            Award Number
          </label>
          <Input
            id="award_number"
            name="award_number"
            value={formData.award_number}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2 col-span-2">
          <label htmlFor="abstract" className="text-sm font-medium">
            Abstract
          </label>
          <Textarea
            id="abstract"
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
            required
            className="min-h-[150px]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="principal_investigator"
            className="text-sm font-medium"
          >
            Principal Investigator
          </label>
          <Input
            id="principal_investigator"
            name="principal_investigator"
            value={formData.principal_investigator}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="pi_email_address" className="text-sm font-medium">
            PI Email Address
          </label>
          <Input
            id="pi_email_address"
            name="pi_email_address"
            type="email"
            value={formData.pi_email_address}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="co_pi_names" className="text-sm font-medium">
            Co-PI Names
          </label>
          <Input
            id="co_pi_names"
            name="co_pi_names"
            value={formData.co_pi_names}
            onChange={handleChange}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="award_instrument" className="text-sm font-medium">
            Grant Type
          </label>
          <Input
            id="award_instrument"
            name="award_instrument"
            value={formData.award_instrument}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <label htmlFor="start_date" className="text-sm font-medium">
            Start Date
          </label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="end_date" className="text-sm font-medium">
            End Date
          </label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="last_amendment_date" className="text-sm font-medium">
            Last Amendment Date
          </label>
          <Input
            id="last_amendment_date"
            name="last_amendment_date"
            type="date"
            value={formData.last_amendment_date}
            onChange={handleChange}
            className="h-12"
          />
        </div>

        {/* Organization Information */}
        <div className="space-y-2">
          <label htmlFor="organization" className="text-sm font-medium">
            Organization
          </label>
          <Input
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            required
            placeholder="Columbia University"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="organization_street" className="text-sm font-medium">
            Street Address
          </label>
          <Input
            id="organization_street"
            name="organization_street"
            value={formData.organization_street}
            onChange={handleChange}
            required
            placeholder="615 W 131ST ST"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="organization_city" className="text-sm font-medium">
            City
          </label>
          <Input
            id="organization_city"
            name="organization_city"
            value={formData.organization_city}
            onChange={handleChange}
            required
            placeholder="New York"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="organization_state" className="text-sm font-medium">
            State
          </label>
          <Input
            id="organization_state"
            name="organization_state"
            value={formData.organization_state}
            onChange={handleChange}
            required
            placeholder="NY"
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="organization_zip" className="text-sm font-medium">
            ZIP Code
          </label>
          <Input
            id="organization_zip"
            name="organization_zip"
            value={formData.organization_zip}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="organization_phone" className="text-sm font-medium">
            Phone
          </label>
          <Input
            id="organization_phone"
            name="organization_phone"
            value={formData.organization_phone}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        {/* NSF Information */}
        <div className="space-y-2">
          <label htmlFor="nsf_organization" className="text-sm font-medium">
            NSF Organization
          </label>
          <Input
            id="nsf_organization"
            name="nsf_organization"
            value={formData.nsf_organization}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="nsf_directorate" className="text-sm font-medium">
            NSF Directorate
          </label>
          <Input
            id="nsf_directorate"
            name="nsf_directorate"
            value={formData.nsf_directorate}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="program_manager" className="text-sm font-medium">
            Program Manager
          </label>
          <Input
            id="program_manager"
            name="program_manager"
            value={formData.program_manager}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="programs" className="text-sm font-medium">
            Programs
          </label>
          <Input
            id="programs"
            name="programs"
            value={formData.programs}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="program_element_codes"
            className="text-sm font-medium"
          >
            Program Element Codes
          </label>
          <Input
            id="program_element_codes"
            name="program_element_codes"
            value={formData.program_element_codes}
            onChange={handleChange}
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="program_reference_codes"
            className="text-sm font-medium"
          >
            Program Reference Codes
          </label>
          <Input
            id="program_reference_codes"
            name="program_reference_codes"
            value={formData.program_reference_codes}
            onChange={handleChange}
            className="h-12"
          />
        </div>

        {/* Financial Information */}
        <div className="space-y-2">
          <label
            htmlFor="awarded_amount_to_date"
            className="text-sm font-medium"
          >
            Awarded Amount to Date ($)
          </label>
          <Input
            id="awarded_amount_to_date"
            name="awarded_amount_to_date"
            type="number"
            step="0.01"
            value={formData.awarded_amount_to_date}
            onChange={handleChange}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="arra_amount" className="text-sm font-medium">
            Requested Amount ($)
          </label>
          <Input
            id="arra_amount"
            name="arra_amount"
            type="number"
            step="0.01"
            value={formData.arra_amount}
            onChange={handleChange}
            className="h-12"
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

      {success && (
        <p className="text-sm text-green-500 mt-4">
          Research project submitted successfully!
        </p>
      )}

      <div className="flex justify-end gap-4 pt-6">
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
            "Submit Research Project"
          )}
        </Button>
      </div>
    </form>
  );
}
