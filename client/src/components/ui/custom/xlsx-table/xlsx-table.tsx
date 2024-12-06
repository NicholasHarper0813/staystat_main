import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState } from "react";
import PaginationXlsxTable from "@/components/ui/custom/xlsx-table/pagination/pagination-xlsx-table";
import SearchXlsxTable from "@/components/ui/custom/xlsx-table/search/Search-xlsx-table";
import useScreenSize from "@/hook/sreensize/useScreenSize";
import XlsxTableAction from "@/components/ui/custom/xlsx-table/action/xlsx-table-action";

interface IGuest {
  "Hotel Name": string;
  "Guest Name": string;
  "Guest Contact": string;
  "Guest Email": string;
  "Check-In Date": string;
  "Check-Out Date": string;
  "Number of Rooms": string;
  "Number of Person": string;
  "Room Category": string;
  "Booking Amount": number;
  "Advance Amount": number;
  "Advance Date": string;
  "Account Type": string;
  "Booking Source": string;
  "Booked By": string;
  "Booking Status": string;
  "Modified Date": string;
  Plan: string;
  Remarks: string;
}

interface ICustomTableProps {
  data: IGuest[];
  setXlsxFile: React.Dispatch<React.SetStateAction<IGuest[]>>;
}
export default function XlsxTable({ data, setXlsxFile }: ICustomTableProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [height] = useScreenSize();
  const isMobile = height <= 768;
  const itemsPerPage: number = isMobile ? 2 : 4;

  const filteredData: IGuest[] = data.filter((item: IGuest) =>
    Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  const pages: number = Math.ceil(filteredData.length / itemsPerPage);

  const currentItems: IGuest[] = React.useMemo(() => {
    const start: number = (currentPage - 1) * itemsPerPage;
    const end: number = start + itemsPerPage;

    return filteredData.slice(start, end);
  }, [currentPage, filteredData]);

  const deleteItem = (index: number) => {
    const newData = [...data];
    newData.splice(index, 1);
    setXlsxFile(newData);
  };
  return (
    <>
      <SearchXlsxTable searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="relative overflow-auto max-h-[560px]  mt-2">
        <Table>
          <TableCaption>A list of your guest bookings.</TableCaption>
          <TableHeader className="sticky top-0 text-xs text-gray-900 uppercase bg-gray-200 dark:bg-gray-700 dark:text-gray-400 rounded-lg">
            <TableRow className="whitespace-nowrap">
              <TableHead>Hotel Name</TableHead>
              <TableHead>Guest Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Check-In Date</TableHead>
              <TableHead>Check-Out Date</TableHead>
              <TableHead>Number of Rooms</TableHead>
              <TableHead>Number of Person</TableHead>
              <TableHead>Room Category</TableHead>
              <TableHead>Booking Amount</TableHead>
              <TableHead>Advance Amount</TableHead>
              <TableHead>Due Amount</TableHead>
              <TableHead>Advance Date</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead>Booking Source</TableHead>
              <TableHead>Booked By</TableHead>
              <TableHead>Booking Status</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Hotel Name"]}
                  </XlsxTableAction>
                </TableCell>

                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Guest Name"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Guest Contact"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Guest Email"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Check-In Date"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Check-Out Date"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Number of Rooms"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Number of Person"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Room Category"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Booking Amount"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Advance Amount"]}
                  </XlsxTableAction>
                </TableCell>

                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Booking Amount"] - item["Advance Amount"]}
                  </XlsxTableAction>
                </TableCell>

                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Advance Date"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Account Type"]}
                  </XlsxTableAction>
                </TableCell>

                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Booking Source"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Booked By"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Booking Status"]}
                  </XlsxTableAction>
                </TableCell>
                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Plan"]}
                  </XlsxTableAction>
                </TableCell>

                <TableCell>
                  <XlsxTableAction
                    title="Are you sure you want to delete?"
                    description={`${item["Guest Name"]} ${item["Guest Contact"]} will be deleted.`}
                    onDelete={() => deleteItem(index)}
                  >
                    {item["Remarks"]}
                  </XlsxTableAction>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <PaginationXlsxTable
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </>
  );
}
