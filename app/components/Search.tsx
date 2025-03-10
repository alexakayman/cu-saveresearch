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
  onGrantTypeChange: (type: string) => void;
  onAmountRangeChange: (range: string) => void;
}

export default function Search({
  onSearch,
  onGrantTypeChange,
  onAmountRangeChange,
}: SearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrantType, setSelectedGrantType] = useState<string>("");
  const [selectedAmountRange, setSelectedAmountRange] = useState<string>("");

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleGrantTypeSelect = (type: string) => {
    setSelectedGrantType(type);
    onGrantTypeChange(type);
  };

  const handleAmountRangeSelect = (range: string) => {
    setSelectedAmountRange(range);
    onAmountRangeChange(range);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search for impacted research..."
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

        {/* Grant Type Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="h-[46px] w-full md:w-[180px] justify-between border-[#012169] text-[#012169] hover:bg-[#012169] hover:text-white"
            >
              {selectedGrantType || "Grant Type"}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 bg-white">
            <Command className="bg-white">
              <CommandInput
                placeholder="Search grant types..."
                className="h-9"
              />
              <CommandList className="bg-white">
                <CommandEmpty>No grant type found.</CommandEmpty>
                <CommandGroup className="bg-white">
                  <CommandItem
                    className="cursor-pointer hover:bg-[#012169] hover:text-white"
                    onSelect={() => handleGrantTypeSelect("Standard Grant")}
                  >
                    Standard Grant
                  </CommandItem>
                  <CommandItem
                    className="cursor-pointer hover:bg-[#012169] hover:text-white"
                    onSelect={() => handleGrantTypeSelect("Continuing Grant")}
                  >
                    Continuing Grant
                  </CommandItem>
                  <CommandItem
                    className="cursor-pointer hover:bg-[#012169] hover:text-white"
                    onSelect={() =>
                      handleGrantTypeSelect("Cooperative Agreement")
                    }
                  >
                    Cooperative Agreement
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Amount Range Dropdown */}
        <Select
          onValueChange={handleAmountRangeSelect}
          value={selectedAmountRange}
        >
          <SelectTrigger className="h-[46px] w-full md:w-[180px] border-[#012169] text-[#012169] hover:bg-[#012169] hover:text-white">
            <SelectValue placeholder="Amount Range" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem
              value="under500k"
              className="hover:bg-[#012169] hover:text-white"
            >
              Under $500K
            </SelectItem>
            <SelectItem
              value="500k-1m"
              className="hover:bg-[#012169] hover:text-white"
            >
              $500K - $1M
            </SelectItem>
            <SelectItem
              value="1m-5m"
              className="hover:bg-[#012169] hover:text-white"
            >
              $1M - $5M
            </SelectItem>
            <SelectItem
              value="5m-10m"
              className="hover:bg-[#012169] hover:text-white"
            >
              $5M - $10M
            </SelectItem>
            <SelectItem
              value="over10m"
              className="hover:bg-[#012169] hover:text-white"
            >
              Over $10M
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
