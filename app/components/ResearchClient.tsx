"use client";

import { useState } from "react";
import Search from "./Search";
import ResearchTable from "./ResearchTable";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "../lib/supabase";
import PledgeModal from "./PledgeModal";
import ClaimResearchModal from "./ClaimResearchModal";

interface ResearchData {
  id: number;
  awardNumber: string;
  researchName: string;
  impactArea: string;
  amount: number;
  principal_investigator: string;
  pi_email_address: string;
  award_instrument: string;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

interface ResearchClientProps {
  initialData: ResearchData[];
  initialTotalCount: number;
}

export default function ResearchClient({
  initialData,
  initialTotalCount,
}: ResearchClientProps) {
  const [filteredData, setFilteredData] = useState<ResearchData[]>(initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrantType, setSelectedGrantType] = useState("");
  const [selectedAmountRange, setSelectedAmountRange] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [pageInput, setPageInput] = useState("1");
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState<ResearchData | null>(
    null
  );

  const fetchData = async (
    page: number,
    itemsPerPage: number,
    searchTerm: string = "",
    grantType: string = "",
    amountRange: string = ""
  ) => {
    try {
      setIsLoading(true);
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      let query = supabase
        .from("research")
        .select(
          `
          id,
          award_number,
          title,
          awarded_amount_to_date,
          principal_investigator,
          pi_email_address,
          award_instrument
        `,
          { count: "exact" }
        )
        .order("award_number", { ascending: true })
        .range(start, end);

      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      if (grantType) {
        query = query.eq("award_instrument", grantType);
      }

      if (amountRange) {
        switch (amountRange) {
          case "under500k":
            query = query.lt("awarded_amount_to_date", 500000);
            break;
          case "500k-1m":
            query = query
              .gte("awarded_amount_to_date", 500000)
              .lt("awarded_amount_to_date", 1000000);
            break;
          case "1m-5m":
            query = query
              .gte("awarded_amount_to_date", 1000000)
              .lt("awarded_amount_to_date", 5000000);
            break;
          case "5m-10m":
            query = query
              .gte("awarded_amount_to_date", 5000000)
              .lt("awarded_amount_to_date", 10000000);
            break;
          case "over10m":
            query = query.gte("awarded_amount_to_date", 10000000);
            break;
        }
      }

      const { data, count, error } = await query;

      if (error) throw error;

      const formattedData: ResearchData[] = data.map((item) => ({
        id: item.id,
        awardNumber: item.award_number,
        researchName: item.title,
        impactArea: "Environment",
        amount: item.awarded_amount_to_date || 0,
        principal_investigator: item.principal_investigator || "",
        pi_email_address: item.pi_email_address || "",
        award_instrument: item.award_instrument || "",
      }));

      setFilteredData(formattedData);
      setTotalCount(count || 0);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while fetching data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setPageInput("1");
    await fetchData(
      1,
      itemsPerPage,
      term,
      selectedGrantType,
      selectedAmountRange
    );
  };

  const handleGrantTypeChange = async (type: string) => {
    setSelectedGrantType(type);
    setCurrentPage(1);
    setPageInput("1");
    await fetchData(1, itemsPerPage, searchTerm, type, selectedAmountRange);
  };

  const handleAmountRangeChange = async (range: string) => {
    setSelectedAmountRange(range);
    setCurrentPage(1);
    setPageInput("1");
    await fetchData(1, itemsPerPage, searchTerm, selectedGrantType, range);
  };

  const handleSupport = (awardNumber: string) => {
    const research = filteredData.find(
      (item) => item.awardNumber === awardNumber
    );
    if (research) {
      setSelectedResearch(research);
      setIsPledgeModalOpen(true);
    }
  };

  const handleClaim = (awardNumber: string) => {
    const research = filteredData.find(
      (item) => item.awardNumber === awardNumber
    );
    if (research) {
      setSelectedResearch(research);
      setIsClaimModalOpen(true);
    }
  };

  const handleViewExternal = (awardNumber: string) => {
    console.log("View external clicked for award:", awardNumber);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInput(value);
  };

  const handlePageInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      await fetchData(
        pageNum,
        itemsPerPage,
        searchTerm,
        selectedGrantType,
        selectedAmountRange
      );
    }
  };

  const handleItemsPerPageChange = async (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setPageInput("1");
    await fetchData(
      1,
      newItemsPerPage,
      searchTerm,
      selectedGrantType,
      selectedAmountRange
    );
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <Search
        onSearch={handleSearch}
        onGrantTypeChange={handleGrantTypeChange}
        onAmountRangeChange={handleAmountRangeChange}
      />

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#012169] mx-auto"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 m-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#012169]">Show</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
              >
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option.toString()}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-[#012169]">items per page</span>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={async () => {
                  const newPage = Math.max(currentPage - 1, 1);
                  setCurrentPage(newPage);
                  setPageInput(newPage.toString());
                  await fetchData(
                    newPage,
                    itemsPerPage,
                    searchTerm,
                    selectedGrantType,
                    selectedAmountRange
                  );
                }}
                disabled={currentPage === 1}
                className="border-[#012169] text-[#012169] hover:bg-[#012169] hover:text-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <form
                onSubmit={handlePageInputSubmit}
                className="flex items-center gap-2"
              >
                <span className="text-sm text-[#012169]">Page</span>
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={pageInput}
                  onChange={handlePageInputChange}
                  className="w-16 text-center focus-visible:ring-[#012169]"
                />
                <span className="text-sm text-[#012169]">of {totalPages}</span>
              </form>

              <Button
                variant="outline"
                onClick={async () => {
                  const newPage = Math.min(currentPage + 1, totalPages);
                  setCurrentPage(newPage);
                  setPageInput(newPage.toString());
                  await fetchData(
                    newPage,
                    itemsPerPage,
                    searchTerm,
                    selectedGrantType,
                    selectedAmountRange
                  );
                }}
                disabled={currentPage === totalPages}
                className="border-[#012169] text-[#012169] hover:bg-[#012169] hover:text-white"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ResearchTable
            data={filteredData}
            onSupport={handleSupport}
            onClaim={handleClaim}
            onViewExternal={handleViewExternal}
          />

          {selectedResearch && (
            <>
              <PledgeModal
                isOpen={isPledgeModalOpen}
                onClose={() => {
                  setIsPledgeModalOpen(false);
                  setSelectedResearch(null);
                }}
                researchId={selectedResearch.id}
                researchTitle={selectedResearch.researchName}
                awardInstrument={selectedResearch.award_instrument}
                principalInvestigator={selectedResearch.principal_investigator}
              />
              <ClaimResearchModal
                isOpen={isClaimModalOpen}
                onClose={() => {
                  setIsClaimModalOpen(false);
                  setSelectedResearch(null);
                }}
                researchId={selectedResearch.id}
                researchTitle={selectedResearch.researchName}
                awardInstrument={selectedResearch.award_instrument}
                principalInvestigator={selectedResearch.principal_investigator}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
