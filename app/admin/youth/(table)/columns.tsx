"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components//ui/badge"
import { Actions } from "./actions"
import { labels } from "./data"

type YouthWithClass = {
  id: number
  full_name: string
  full_address: string
  remark: string
  name: string
  year_start: string
  short_name: string
}

export const columns: ColumnDef<YouthWithClass>[] = []

export function getColumns({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (id: string | number) => void
  onEdit: (id: string | number) => void
  onDelete: (id: string | number) => void
}): ColumnDef<YouthWithClass>[] {
  return [
    {
      accessorKey: "full_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ชื่อ-นามสกุล" />
      ),
      cell: ({ row }) => {
        const label = labels.find((label) => label.value === row.original.full_name)

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("full_name")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "full_address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ที่อยู่" />
      ),
      cell: ({ row }) => {
        const label = labels.find((label) => label.value === row.original.full_address)

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("full_address")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "year_start",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ปีที่เริ่ม" />
      ),
      cell: ({ row }) => {
        const label = labels.find((label) => label.value === row.original.year_start)

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("year_start")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "short_name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ชั้นที่เริ่ม" />
      ),
      cell: ({ row }) => {
        const label = labels.find((label) => label.value === row.original.short_name)

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("short_name")}
            </span>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      accessorKey: "remark",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="หมายเหตุ" />
      ),
      cell: ({ row }) => {
        const label = labels.find((label) => label.value === row.original.remark)

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("remark")}
            </span>
          </div>
        )
      },
      enableSorting: false,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Actions
          row={row}
          idKey="id"
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ),
    },
  ]
}