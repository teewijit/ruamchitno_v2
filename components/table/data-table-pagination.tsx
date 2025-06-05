import { Table } from "@tanstack/react-table"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Button } from "../ui/button"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  totalPages: number
  currentPage: number
  selected?: boolean 
  onPageChange: (page: number) => void
  onTotalItemsChange?: (totalItems: number) => void
}

export function DataTablePagination<TData>({
  table,
  onPageChange,
  totalPages,
  currentPage,
  selected = false,
  onTotalItemsChange,
}: DataTablePaginationProps<TData>) {

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const handleTotalItemsChange = (value: number) => {
    table.setPageSize(value);
    if (onTotalItemsChange) {
      onTotalItemsChange(value);
    }
  };

  return (
    <div className="flex items-center justify-between px-2">
      {/* แก้ไข syntax การแสดง selected */}
      {selected && (
        <div className="flex-1 text-sm text-muted-foreground">
          เลือก {table.getFilteredSelectedRowModel().rows.length} จาก{" "}
          {table.getFilteredRowModel().rows.length} รายการ
        </div>
      )}
      
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">แสดงต่อหน้า</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              handleTotalItemsChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={`${table.getState().pagination.pageSize}`} />
            </SelectTrigger>
            <SelectContent side="bottom">
              {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          หน้า {currentPage > totalPages ? 1 : currentPage} จาก {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">ไปหน้าแรก</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">ไปหน้าก่อนหน้า</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">ไปหน้าถัดไป</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">ไปหน้าสุดท้าย</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}