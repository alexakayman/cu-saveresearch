"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { use } from "react";
import Image from "next/image";
import PledgeModal from "../../components/PledgeModal";
import ClaimResearchModal from "../../components/ClaimResearchModal";

interface ResearchDetails {
  id: number;
  award_number: string;
  title: string;
  awarded_amount_to_date: number;
  principal_investigator: string;
  pi_email_address: string;
  award_instrument: string;
  abstract: string;
  nsf_organization: string;
  programs: string[];
  start_date: string;
  last_amendment_date: string;
  co_pi_names: string[];
  research_claims?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    amended_amount: number | null;
    asks: string | null;
  }[];
}

export default function ResearchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [research, setResearch] = useState<ResearchDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  useEffect(() => {
    const fetchResearchDetails = async () => {
      try {
        setIsLoading(true);

        // First, get the research details
        const { data: researchData, error: researchError } = await supabase
          .from("research")
          .select(
            `
            id,
            award_number,
            title,
            awarded_amount_to_date,
            principal_investigator,
            pi_email_address,
            award_instrument,
            abstract,
            nsf_organization,
            programs,
            start_date,
            last_amendment_date,
            co_pi_names
          `
          )
          .eq("award_number", id)
          .single();

        if (researchError) throw researchError;

        console.log("Research ID:", researchData.id);

        // Then, get the research claims for this research
        const { data: claimsData, error: claimsError } = await supabase
          .from("research_claims")
          .select("*")
          .eq("research_id", researchData.id);

        if (claimsError) throw claimsError;

        console.log("Research data:", researchData);
        console.log("Claims data:", claimsData);

        // Transform the data to ensure arrays are properly handled
        const transformedData: ResearchDetails = {
          ...researchData,
          programs: Array.isArray(researchData.programs)
            ? researchData.programs
            : [],
          co_pi_names: Array.isArray(researchData.co_pi_names)
            ? researchData.co_pi_names
            : [],
          research_claims: Array.isArray(claimsData) ? claimsData : [],
        };

        console.log("Transformed data:", transformedData);
        console.log(
          "Research claims after transform:",
          transformedData.research_claims
        );

        setResearch(transformedData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching research details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchResearchDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012169] mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !research) {
    return (
      <div className="min-h-screen p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <div className=" rounded-3xl shadow-lg p-8">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
            <p className="text-gray-600">{error || "Research not found"}</p>
            <Link
              href="/"
              className="inline-flex items-center text-[#012169] hover:text-[#001345] mt-4"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Research List
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-6 md:p-12">
      {/* Background Image */}
      <div className="fixed top-0 left-0 right-0 h-full -z-10 overflow-hidden rounded-b-[36px]">
        <Image
          src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/columbia-university-john-stoeckley.jpg"
          alt="Campus background"
          width={1920}
          height={1080}
          priority
          className="w-full h-full object-cover object-top opacity-20"
        />
      </div>

      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center text-[#012169] hover:text-[#001345] mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Research List
        </Link>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-[#012169] text-white p-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{research.title}</h1>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-white/10 px-3 py-1 rounded-full">
                  {research.award_instrument}
                </span>
                <span>
                  Principal Investigator:{" "}
                  <a
                    href={`mailto:${research.pi_email_address}`}
                    className="hover:text-gray-200 hover:underline"
                  >
                    {research.principal_investigator}
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="space-y-8">
              {/* Abstract */}
              <div>
                <h2 className="text-xl font-semibold text-[#012169] mb-4">
                  Abstract
                </h2>
                <div
                  className={`relative ${
                    !showFullAbstract ? "max-h-[250px]" : ""
                  } overflow-hidden`}
                >
                  <p className="text-gray-700 leading-relaxed">
                    {research.abstract}
                  </p>
                  {!showFullAbstract && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
                  )}
                </div>
                <button
                  onClick={() => setShowFullAbstract(!showFullAbstract)}
                  className="mt-2 text-[#012169] hover:text-[#001345] flex items-center gap-1 text-sm"
                >
                  {showFullAbstract ? (
                    <>
                      Show Less <ChevronUp className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Research Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-1">
                    Award Number
                  </h2>
                  <p className="text-[#012169]">{research.award_number}</p>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-1">
                    Amount Awarded
                  </h2>
                  <p className="text-[#012169] tabular-nums">
                    {formatCurrency(research.awarded_amount_to_date)}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-1">
                    NSF Organization
                  </h2>
                  <p className="text-[#012169]">{research.nsf_organization}</p>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-1">
                    Programs
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {research.programs.map((program, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-[#012169] px-3 py-1 rounded-full text-sm"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-1">
                    Start Date
                  </h2>
                  <p className="text-[#012169]">
                    {formatDate(research.start_date)}
                  </p>
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-500 mb-1">
                    Last Amendment Date
                  </h2>
                  <p className="text-[#012169]">
                    {formatDate(research.last_amendment_date)}
                  </p>
                </div>

                {research.co_pi_names.length > 0 && (
                  <div className="md:col-span-2">
                    <h2 className="text-sm font-semibold text-gray-500 mb-1">
                      Co-Principal Investigators
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {research.co_pi_names.map((coPi, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-[#012169] px-3 py-1 rounded-full text-sm"
                        >
                          {coPi}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Research Claims Table */}
              {research.research_claims && (
                <div className="mt-8">
                  <h2 className="text-xl font-semibold text-[#012169] mb-4">
                    Research Asks ({research.research_claims.length})
                  </h2>
                  {research.research_claims.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-[#012169] text-white">
                            <th className="px-6 py-3 text-left text-sm font-medium">
                              Submitter
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium">
                              Amended Amount
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-medium">
                              Additional Asks
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {research.research_claims.map((claim) => (
                            <tr
                              key={claim.id}
                              className="border-b border-gray-200"
                            >
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {claim.first_name} {claim.last_name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {claim.email}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {claim.amended_amount
                                  ? new Intl.NumberFormat("en-US", {
                                      style: "currency",
                                      currency: "USD",
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 0,
                                    }).format(claim.amended_amount)
                                  : "-"}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {claim.asks || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500">No research claims found.</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-6 flex gap-4">
                <a
                  href={`https://www.nsf.gov/awardsearch/showAward?AWD_ID=${research.award_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#012169] hover:text-[#001345] inline-flex items-center gap-1 underline"
                >
                  View on NSF
                  <ExternalLink className="h-4 w-4" />
                </a>
                <button
                  onClick={() => setIsPledgeModalOpen(true)}
                  className="border border-[#012169] text-[#012169] px-6 py-3 rounded-full text-sm hover:bg-[#f1f5f9] transition-colors"
                >
                  Pledge Support
                </button>
                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className="bg-[#012169] text-white px-6 py-3 rounded-full text-sm hover:bg-[#001345] transition-colors"
                >
                  Claim Research
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pledge Modal */}
        {research && (
          <PledgeModal
            isOpen={isPledgeModalOpen}
            onClose={() => setIsPledgeModalOpen(false)}
            researchId={research.id}
            researchTitle={research.title}
            awardInstrument={research.award_instrument}
            principalInvestigator={research.principal_investigator}
          />
        )}

        {/* Claim Research Modal */}
        {research && (
          <ClaimResearchModal
            isOpen={isClaimModalOpen}
            onClose={() => setIsClaimModalOpen(false)}
            researchId={research.id}
            researchTitle={research.title}
            awardInstrument={research.award_instrument}
            principalInvestigator={research.principal_investigator}
          />
        )}
      </div>
    </div>
  );
}
