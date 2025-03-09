"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ExternalLink } from "lucide-react";
import { useState } from "react";

interface SearchProps {
  onSearch: (searchTerm: string) => void;
  onImpactAreaChange: (area: string) => void;
  onExpiryChange: (year: string) => void;
}

export default function Search({
  onSearch,
  onImpactAreaChange,
  onExpiryChange,
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImpactArea, setSelectedImpactArea] = useState<string>("");
  const [selectedExpiry, setSelectedExpiry] = useState<string>("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleImpactAreaSelect = (area: string) => {
    setSelectedImpactArea(area);
    onImpactAreaChange(area);
  };

  const handleExpirySelect = (year: string) => {
    setSelectedExpiry(year);
    onExpiryChange(year);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search for projects..."
            className="w-full h-[46px] px-4 py-3 border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#012169]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        <button
          className="h-[46px] bg-[#012169] text-white px-8 py-3 rounded-lg hover:bg-[#001345] transition-colors"
          onClick={handleSearch}
        >
          Search
        </button>

        {/* Impact Areas Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="h-[46px] w-full md:w-[180px] justify-between border-[#012169] text-[#012169] hover:bg-[#012169] hover:text-white"
            >
              {selectedImpactArea || "Impact Areas"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-white">
            <Command className="bg-white">
              <CommandInput placeholder="Search fields..." className="h-9" />
              <CommandList className="bg-white">
                <CommandEmpty>No area found.</CommandEmpty>
                <CommandGroup className="bg-white">
                  <CommandItem
                    className="cursor-pointer hover:bg-[#012169] hover:text-white"
                    onSelect={() => handleImpactAreaSelect("Cancer")}
                  >
                    Cancer
                  </CommandItem>
                  <CommandItem
                    className="cursor-pointer hover:bg-[#012169] hover:text-white"
                    onSelect={() => handleImpactAreaSelect("Longevity")}
                  >
                    Longevity
                  </CommandItem>
                  <CommandItem
                    className="cursor-pointer hover:bg-[#012169] hover:text-white"
                    onSelect={() => handleImpactAreaSelect("Anthropology")}
                  >
                    Anthropology
                  </CommandItem>
                  <CommandItem
                    className="cursor-pointer hover:bg-[#012169] hover:text-white"
                    onSelect={() => handleImpactAreaSelect("Neuroscience")}
                  >
                    Neuroscience
                  </CommandItem>
                  <CommandItem
                    className="cursor-pointer hover:bg-[#012169] hover:text-white"
                    onSelect={() => handleImpactAreaSelect("Environment")}
                  >
                    Environment
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Expires Dropdown */}
        <Select onValueChange={handleExpirySelect} value={selectedExpiry}>
          <SelectTrigger className="h-[46px] w-full md:w-[180px] border-[#012169] text-[#012169] hover:bg-[#012169] hover:text-white">
            <SelectValue placeholder="Expires" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem
              value="2025"
              className="hover:bg-[#012169] hover:text-white"
            >
              2025
            </SelectItem>
            <SelectItem
              value="2024"
              className="hover:bg-[#012169] hover:text-white"
            >
              2024
            </SelectItem>
            <SelectItem
              value="2023"
              className="hover:bg-[#012169] hover:text-white"
            >
              2023
            </SelectItem>
            <SelectItem
              value="2022"
              className="hover:bg-[#012169] hover:text-white"
            >
              2022
            </SelectItem>
            <SelectItem
              value="2021"
              className="hover:bg-[#012169] hover:text-white"
            >
              2021
            </SelectItem>
            <SelectItem
              value="2020"
              className="hover:bg-[#012169] hover:text-white"
            >
              2020
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
