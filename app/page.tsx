"use client";

import { useState, useEffect } from "react";
import Search from "./components/Search";
import ResearchTable from "./components/ResearchTable";
import Link from "next/link";
import { supabase } from "./lib/supabase";
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
import Image from "next/image";

interface ResearchData {
  awardNumber: string;
  researchName: string;
  impactArea: string;
  amount: number;
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function Home() {
  const [filteredData, setFilteredData] = useState<ResearchData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImpactArea, setSelectedImpactArea] = useState("");
  const [selectedExpiry, setSelectedExpiry] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [pageInput, setPageInput] = useState("1");

  useEffect(() => {
    fetchResearchData();
  }, [currentPage, itemsPerPage]);

  const fetchResearchData = async () => {
    try {
      setIsLoading(true);
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage - 1;

      // First, get the total count
      const { count } = await supabase
        .from("research")
        .select("*", { count: "exact", head: true });

      if (count !== null) {
        setTotalCount(count);
      }

      // Then fetch the paginated data
      const { data, error } = await supabase
        .from("research")
        .select("award_number, title, awarded_amount_to_date")
        .range(start, end)
        .order("award_number", { ascending: true });

      if (error) throw error;

      const formattedData: ResearchData[] = data.map((item) => ({
        awardNumber: item.award_number,
        researchName: item.title,
        impactArea: "Cancer", // Keeping as is as requested
        amount: item.awarded_amount_to_date || 0,
      }));

      setFilteredData(formattedData);
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
    setCurrentPage(1); // Reset to first page on new search
    setPageInput("1");
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("research")
        .select("award_number, title, awarded_amount_to_date")
        .ilike("title", `%${term}%`)
        .range(0, itemsPerPage - 1)
        .order("award_number", { ascending: true });

      if (error) throw error;

      const formattedData: ResearchData[] = data.map((item) => ({
        awardNumber: item.award_number,
        researchName: item.title,
        impactArea: "Environment",
        amount: item.awarded_amount_to_date || 0,
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
    setCurrentPage(1); // Reset to first page on filter change
    setPageInput("1");
    // Filter the data based on impact area
    const filtered = filteredData.filter(
      (item) => area === "" || item.impactArea === area
    );
    setFilteredData(filtered);
  };

  const handleExpiryChange = (year: string) => {
    setSelectedExpiry(year);
    // Implement expiry filtering logic here if needed
  };

  const handleSupport = (awardNumber: string) => {
    // Implement support logic here
    console.log("Support clicked for award:", awardNumber);
  };

  const handleClaim = (awardNumber: string) => {
    // Implement claim logic here
    console.log("Claim clicked for award:", awardNumber);
  };

  const handleViewExternal = (awardNumber: string) => {
    // Implement external view logic here
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
    <div className="min-h-screen flex flex-col">
      {/* Background Image */}
      <div className="fixed top-0 left-0 right-0 h-[600px] -z-10 overflow-hidden">
        <Image
          src="https://images.fineartamerica.com/images/artworkimages/mediumlarge/3/columbia-university-john-stoeckley.jpg"
          alt="Campus background"
          width={1920}
          height={600}
          priority
          className="w-full object-cover object-top opacity-20"
        />
      </div>

      {/* Add a gradient overlay */}
      <div className="fixed top-0 left-0 right-0 h-[600px] -z-10 bg-gradient-to-b from-transparent to-[#f8fafc]"></div>

      {/* Header */}
      <header className="py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-[#012169] text-xl font-bold">
            CU Accelerate
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/claim-research"
              className="text-[#012169] hover:text-[#001345]"
            >
              Claim Research
            </Link>
            <Link href="/faq" className="text-[#012169] hover:text-[#001345]">
              FAQ
            </Link>
            <Link
              href="/letter"
              className="text-[#012169] hover:text-[#001345]"
            >
              Letter
            </Link>
            <Link
              href="/support"
              className="bg-[#012169] text-white px-6 py-2 rounded-full hover:bg-[#001345] transition-colors"
            >
              Support
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 md:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-[#012169] mb-6">
              Fund what matters
            </h1>
            <p className="text-[#012169]/70 max-w-3xl mx-auto text-lg">
              For Researchers: Claim your research and add critical needs.
              <br />
              For Supporters: Pledge what you can, share what you can't.
            </p>
          </div>

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
              {/* Pagination Controls */}
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
                    <span className="text-sm text-[#012169]">
                      of {totalPages}
                    </span>
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
        </div>
      </main>
    </div>
  );
}
