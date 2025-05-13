"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components//ui/checkbox"
import { DataTableColumnHeader } from "@/components/table/data-table-column-header"
import { Badge } from "@/components//ui/badge"
import { Actions } from "./actions"
import { SelectUserSchemaType } from "@/zod-schema/user.zod"
import { labels, roles, statuses } from "@/components/table/data"

export const columns: ColumnDef<SelectUserSchemaType>[] = [ /* ... */]

export function getColumns({
  onView,
  onEdit,
  onDelete,
  onChangePassword,
}: {
  onView: (id: string | number) => void
  onEdit: (id: string | number) => void
  onDelete: (id: string | number) => void
  onChangePassword: (id: string | number) => void
}): ColumnDef<SelectUserSchemaType>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Username" />
      ),
      cell: ({ row }) => {
        const label = labels.find((label) => label.value === row.original.username)

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("username")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "fullname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ชื่อ-นามสกุล" />
      ),
      cell: ({ row }) => {
        const label = labels.find((label) => label.value === row.original.fullname)

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("fullname")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => {
        const label = labels.find((label) => label.value === row.original.email)

        return (
          <div className="flex space-x-2">
            {label && <Badge variant="outline">{label.label}</Badge>}
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("email")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ระดับ" />
      ),
      cell: ({ row }) => {
        const role = roles.find(
          (role) => role.value === row.getValue("role")
        )
  
        if (!role) {
          return null
        }
  
        return (
          <div className="flex items-center">
            {role.icon && (
              <role.icon className="mr-2 h-4 w-4 text-muted-foreground" />
            )}
            <span>{role.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="สถานะ" />
      ),
      cell: ({ row }) => {
        const status = statuses.find(
          (status) => status.value === row.getValue("status")
        )

        if (!status) {
          return null
        }

        let colorClass = "bg-gray-500 border-gray-300 text-white";

        if (status.value === "active") {
          colorClass = "bg-green-600 border-green-400 text-white";
        } else if (status.value === "inactive") {
          colorClass = "bg-red-600 border-red-400 text-white";
        } else if (status.value === "delete") {
          colorClass = "bg-gray-500 border-gray-300 text-white";
        }

        return (
          <div className="flex w-[100px] items-center">
            <Badge variant="outline" className={colorClass}>
              <span>{status.label}</span>
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
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
          onChangePassword={onChangePassword}
        />
      ),
    },
  ]
}