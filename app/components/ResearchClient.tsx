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

interface ResearchData {
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
  const [selectedImpactArea, setSelectedImpactArea] = useState("");
  const [selectedExpiry, setSelectedExpiry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [pageInput, setPageInput] = useState("1");

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    setPageInput("1");
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("research")
        .select(
          `
          award_number,
          title,
          awarded_amount_to_date,
          principal_investigator,
          pi_email_address,
          award_instrument
        `
        )
        .ilike("title", `%${term}%`)
        .range(0, itemsPerPage - 1)
        .order("award_number", { ascending: true });

      if (error) throw error;

      const formattedData: ResearchData[] = data.map((item) => ({
        awardNumber: item.award_number,
        researchName: item.title,
        impactArea: "Environment",
        amount: item.awarded_amount_to_date || 0,
        principal_investigator: item.principal_investigator || "",
        pi_email_address: item.pi_email_address || "",
        award_instrument: item.award_instrument || "",
      }));

      setFilteredData(formattedData);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred while searching"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImpactAreaChange = (area: string) => {
    setSelectedImpactArea(area);
    setCurrentPage(1);
    setPageInput("1");
    const filtered = filteredData.filter(
      (item) => area === "" || item.impactArea === area
    );
    setFilteredData(filtered);
  };

  const handleExpiryChange = (year: string) => {
    setSelectedExpiry(year);
  };

  const handleSupport = (awardNumber: string) => {
    console.log("Support clicked for award:", awardNumber);
  };

  const handleClaim = (awardNumber: string) => {
    console.log("Claim clicked for award:", awardNumber);
  };

  const handleViewExternal = (awardNumber: string) => {
    console.log("View external clicked for award:", awardNumber);
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInput(value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput);
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setPageInput("1");
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <>
      <Search
        onSearch={handleSearch}
        onImpactAreaChange={handleImpactAreaChange}
        onExpiryChange={handleExpiryChange}
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
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                  setPageInput(Math.max(currentPage - 1, 1).toString());
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
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  setPageInput(
                    Math.min(currentPage + 1, totalPages).toString()
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
        </>
      )}
    </>
  );
}
