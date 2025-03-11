"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ResearchData {
  awardNumber: string;
  researchName: string;
  impactArea: string;
  amount: number;
  principal_investigator: string;
  pi_email_address: string;
  award_instrument: string;
}

interface ResearchTableProps {
  data: ResearchData[];
  onClaim: (awardNumber: string) => void;
  onViewExternal: (awardNumber: string) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function UnclaimedResearchTable({
  data,
  onClaim,
  onViewExternal,
}: ResearchTableProps) {
  const router = useRouter();

  const handleRowClick = (awardNumber: string) => {
    router.push(`/research/${awardNumber}`);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e2e8f0]">
              <th className="text-left py-4 px-6 font-semibold text-[#012169]">
                Award Number
              </th>
              <th className="text-left py-4 px-6 font-semibold text-[#012169]">
                Research Name
              </th>
              <th className="text-left py-4 px-6 font-semibold text-[#012169]">
                Principal Investigator
              </th>
              <th className="text-left py-4 px-6 font-semibold text-[#012169]">
                Grant Type
              </th>
              {/* <th className="text-left py-4 px-6 font-semibold text-[#012169]">
                Impact Area
              </th> */}
              <th className="text-left py-4 px-6 font-semibold text-[#012169]">
                Amount
              </th>
              <th className="text-left py-4 px-6 font-semibold text-[#012169]">
                Claim Research
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-b border-[#e2e8f0] hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleRowClick(item.awardNumber)}
              >
                <td className="py-4 px-6 text-[#012169]">{item.awardNumber}</td>
                <td className="py-4 px-6 text-[#012169]">
                  {item.researchName}
                </td>
                <td className="py-4 px-6 text-[#012169]">
                  <a
                    href={`mailto:${item.pi_email_address}`}
                    className="hover:text-[#001345] hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {item.principal_investigator}
                  </a>
                </td>
                <td className="py-4 px-6 text-[#012169]">
                  {item.award_instrument}
                </td>
                {/* <td className="py-4 px-6 text-[#012169]">{item.impactArea}</td> */}
                <td className="py-4 px-6 text-[#012169] tabular-nums">
                  {formatCurrency(item.amount)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/research/${item.awardNumber}`}
                      className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="h-5 w-5 text-[#012169]" />
                    </Link>
                    <button
                      className="bg-[#012169] text-white px-4 py-2 rounded-full text-sm hover:bg-[#001345] transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onClaim(item.awardNumber);
                      }}
                    >
                      Claim
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
