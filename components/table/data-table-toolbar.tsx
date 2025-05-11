"use client"

import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { DataTableViewOptions } from "./data-table-view-options"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  search?: string
  onSearchChange?: (value: string) => void
  onResetFilters?: () => void
}

export function DataTableToolbar<TData>({
  table,
  search,
  onSearchChange,
  onResetFilters,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const handleReset = () => {
    onResetFilters?.()
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          value={search ?? ""}
          placeholder="ค้นหา..."
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {(isFiltered || (search && search.length > 0)) && (
          <Button
            variant="default"
            onClick={() => handleReset()}
            className="h-8 px-2 lg:px-3"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
