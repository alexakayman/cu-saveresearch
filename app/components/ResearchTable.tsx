"use client";

import { ExternalLink } from "lucide-react";

interface ResearchData {
  awardNumber: string;
  researchName: string;
  impactArea: string;
  amount: number;
}

interface ResearchTableProps {
  data: ResearchData[];
  onSupport: (awardNumber: string) => void;
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

export default function ResearchTable({
  data,
  onSupport,
  onClaim,
  onViewExternal,
}: ResearchTableProps) {
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
                Impact Area
              </th>
              <th className="text-left py-4 px-6 font-semibold text-[#012169]">
                Amount
              </th>
              <th className="text-left py-4 px-6 font-semibold text-[#012169]">
                Pledge
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b border-[#e2e8f0]">
                <td className="py-4 px-6 text-[#012169]">{item.awardNumber}</td>
                <td className="py-4 px-6 text-[#012169]">
                  {item.researchName}
                </td>
                <td className="py-4 px-6 text-[#012169]">{item.impactArea}</td>
                <td className="py-4 px-6 text-[#012169] tabular-nums">
                  {formatCurrency(item.amount)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-2"
                      onClick={() => onViewExternal(item.awardNumber)}
                    >
                      <ExternalLink className="h-5 w-5 text-[#012169]" />
                    </button>
                    <button
                      className="bg-[#012169] text-white px-4 py-2 rounded-full text-sm hover:bg-[#001345] transition-colors"
                      onClick={() => onSupport(item.awardNumber)}
                    >
                      Support
                    </button>
                    <button
                      className="border border-[#012169] text-[#012169] px-4 py-2 rounded-full text-sm hover:bg-[#f1f5f9] transition-colors"
                      onClick={() => onClaim(item.awardNumber)}
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
