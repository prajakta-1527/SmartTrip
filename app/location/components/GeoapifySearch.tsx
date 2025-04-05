"use client";

import React, { useState } from "react";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";

const categoriesList = [
  { value: "tourism", label: "Tourist Spots" },
  { value: "catering", label: "Restaurants" },
  { value: "accommodation", label: "Hotels" },
];

export default function GeoapifySearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("tourism");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get("/api/geoapify", {
        params: {
          query,
          categories: category,
          limit: 5,
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Find Recommended Places</h3>

      {/* Search Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter a location or place"
        className="w-full p-2 border rounded-md"
      />

      {/* Category Selector */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full flex justify-between">
            {categoriesList.find((c) => c.value === category)?.label || "Select Category"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search category..." />
            <CommandList>
              <CommandEmpty>No category found.</CommandEmpty>
              <CommandGroup>
                {categoriesList.map((cat) => (
                  <CommandItem
                    key={cat.value}
                    value={cat.value}
                    onSelect={() => {
                      setCategory(cat.value);
                      setOpen(false);
                    }}
                  >
                    {cat.label}
                    <Check
                      className={cn("ml-auto", category === cat.value ? "opacity-100" : "opacity-0")}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Search Button */}
      <Button onClick={handleSearch} className="w-full">
        Search
      </Button>

      {/* Results Section */}
      <div className="mt-4 space-y-2">
        {results.length > 0 ? (
          results.map((place, index) => (
            <div key={index} className="border p-3 rounded-md shadow-sm">
              <h4 className="font-semibold">{place.name}</h4>
              <p>{place.address}</p>
              <p className="text-sm text-gray-600">Category: {place.category}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No results found.</p>
        )}
      </div>
    </div>
  );
}
