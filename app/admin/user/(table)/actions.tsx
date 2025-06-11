import { Row } from "@tanstack/react-table"
import { Eye, KeySquare, MoreHorizontal, Pen, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ActionsProps<TData> {
  row: Row<TData>
  onView?: (id: string | number) => void
  onEdit?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  onChangePassword?: (id: string | number) => void
  idKey?: keyof TData
}

export function Actions<TData extends Record<string, any>>({
  row,
  onView,
  onEdit,
  onDelete,
  onChangePassword,
  idKey,
}: ActionsProps<TData>) {

  const key = (idKey ?? "id") as keyof TData;
  const id = row.original[key] as string | number;

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center" className="w-auto p-1 rounded-md shadow-md">
          <div className="flex justify-center items-center gap-1">

            <DropdownMenuItem
              onClick={() => onView?.(id)} // เรียก onView เมื่อคลิกปุ่ม "ดู"
              className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer"
            >
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Eye className="text-blue-500 h-4 w-4 hover:scale-110 transition-transform" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>ดู</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onEdit?.(id)}
              className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer"
            >
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Pen className="text-orange-500 h-4 w-4 hover:scale-110 transition-transform" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>แก้ไข</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onDelete?.(id)}
              className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer"
            >
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <Trash className="text-red-500 h-4 w-4 hover:scale-110 transition-transform" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>ลบ</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onChangePassword?.(id)}
              className="h-8 w-8 p-0 flex items-center justify-center cursor-pointer"
            >
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <KeySquare className="text-purple-500 h-4 w-4 hover:scale-110 transition-transform" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>เปลี่ยนรหัสผ่าน</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </DropdownMenuItem>
            
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
