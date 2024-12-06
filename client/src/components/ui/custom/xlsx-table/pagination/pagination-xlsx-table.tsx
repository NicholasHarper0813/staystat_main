import React from "react";
import { Pagination } from "@nextui-org/react";

interface IPaginationProps {
  pages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}
export default function PaginationXlsxTable({
  pages,
  currentPage,
  setCurrentPage,
}: IPaginationProps) {
  return (
    <Pagination
      className="items-center flex justify-center mt-2 sm:px-2 lg:px-0"
      total={pages}
      initialPage={currentPage}
      onChange={(newPage) => setCurrentPage(newPage)}
    />
  );
}
