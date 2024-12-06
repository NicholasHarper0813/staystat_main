import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ISearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
export default function SearchXlsxTable({
  searchTerm,
  setSearchTerm,
}: ISearchProps) {
  return (
    <div className="relative">
      <Input
        type="text"
        className="filter-search-input"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
        <Search />
      </div>
    </div>
  );
}
