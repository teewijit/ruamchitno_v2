import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DateTime } from "luxon";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CardContent } from "@/components/ui/card";
import useSWR from "swr";
import Loading from "./loading";

interface DataObj {
  id: number;
  table: string;
}

interface AuditLogsProps {
  isOpen: boolean;
  onClose: () => void;
  dataObj: DataObj[];
}

interface AuditLog {
  id: number;
  table: string;
  action: string;
  recordId: number;
  performedAt: string;
  performedBy: {
    id: number;
    name: string;
    email: string;
  };
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const AuditLogs: React.FC<AuditLogsProps> = ({
  isOpen,
  onClose,
  dataObj
}) => {

  const { data, isLoading } = useSWR(
    dataObj.length > 0 ? `/api/audit-logs?id=${dataObj[0].id}&table=${dataObj[0].table}` : null,
    fetcher
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>ประวัติการเปลี่ยนแปลง</DialogTitle>
          <DialogDescription>
            แสดงรายการที่มีการกระทำกับผู้ใช้นี้
          </DialogDescription>
        </DialogHeader>

        <ScrollArea>

          <div className="max-h-[250px] overflow-y-auto">
            {isLoading ? (
              <Loading />
            ) : data && data.length > 0 ? (
              <>
                {data.map((log: AuditLog) => (
                  <CardContent key={log.id} className="border rounded p-5 mb-3 me-2">
                    <p className="text-sm">
                      <strong>Action : </strong>{" "}
                      <Badge
                        className={`${log.action === "create"
                          ? "bg-blue-500"
                          : log.action === "update"
                            ? "bg-yellow-500"
                            : log.action === "delete"
                              ? "bg-red-500"
                              : ""
                          }`}
                      >
                        {log.action.toUpperCase()}
                      </Badge>
                    </p>
                    <p className="text-sm">
                      <strong>โดย : </strong> {log.performedBy.name}
                    </p>
                    <p className="text-sm">
                      <strong>เวลา : </strong>{" "}
                      {DateTime.fromISO(log.performedAt)
                        .setLocale("th")
                        .toFormat("dd LLL yyyy เวลา HH:mm")}{" "}
                      น.
                    </p>
                  </CardContent>
                ))}
              </>
            ) : (
              <p>ไม่พบข้อมูลประวัติ</p>
            )}
          </div>
        </ScrollArea>

      </DialogContent>
    </Dialog>
  );
};
