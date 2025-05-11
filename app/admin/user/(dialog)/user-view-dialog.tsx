import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react";

interface ViewDialogProps {
    isOpen: boolean;
    onClose: () => void;
    viewData: any;
}

export const UserViewDialog: React.FC<ViewDialogProps> = ({ isOpen, onClose, viewData }) => {
    const [historyData, setHistoryData] = useState<any>(null);  // เก็บข้อมูลประวัติ
    const [loading, setLoading] = useState<boolean>(false);  // ใช้สำหรับเช็คสถานะการโหลด

    useEffect(() => {
        const fetchHistory = async () => {
            if (viewData && viewData.id) {
                setLoading(true);  // เริ่มการโหลดข้อมูล
                try {
                    const data = {};  // เรียก getHistory
                    setHistoryData(data);  // เก็บข้อมูลที่ได้
                } catch (error) {
                    console.error("Error fetching history:", error);
                } finally {
                    setLoading(false);  // การโหลดเสร็จสิ้น
                }
            }
        };

        if (isOpen) {  // ดึงข้อมูลเมื่อ dialog เปิด
            fetchHistory();
        }
    }, [isOpen, viewData]);  // เมื่อ isOpen หรือ viewData เปลี่ยนแปลง

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>View Profile</DialogTitle>
                    <DialogDescription>
                        ดูข้อมูลของผู้ใช้ที่เลือก
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {loading ? (
                        <p>กำลังโหลดข้อมูล...</p>  // ขณะโหลดข้อมูล
                    ) : historyData ? (
                        <div>
                            <p>ข้อมูลของผู้ใช้ ID: {viewData.id}</p>
                            <p>สร้างโดย: {historyData.items[0].create_by}</p>
                            <p>อัพเดทโดย: {historyData.items[0].update_by}</p>
                            <p>สร้างเมื่อ: {historyData.items[0].create_at}</p>
                            <p>อัพเดทเมื่อ: {historyData.items[0].update_at}</p>
                        </div>
                    ) : (
                        <p>ไม่พบข้อมูลประวัติ</p>
                    )}
                </div>
                <DialogFooter>
                    <Button type="button" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
