"use client";

import { DataTable } from "@/components/table/data-table";
import { getColumns } from "./columns";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { useCallback, useState } from "react";
import { UserViewDialog } from "../(dialog)/user-view-dialog";
import { toast } from 'sonner';
import { ConfirmDialog } from "@/components/confirm-dialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DEFAULT_TOTAL_ITEMS = 10;

export default function YouthTable() {

    // get param search
    const searchParams = useSearchParams();
    const router = useRouter();

    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const totalItems = parseInt(searchParams.get("totalItems") || String(DEFAULT_TOTAL_ITEMS), 10);

    const queryString = new URLSearchParams({
        page: String(page),
        totalItems: String(totalItems),
        ...(search ? { search } : {}),
    }).toString();

    // query data
    const { data: youths = { items: [], totalPages: 1 }, isLoading, error, mutate } = useSWR(
        `/api/youth?${queryString}`,
        fetcher
    );
    const updateSearchParams = useCallback((updates: Record<string, string | number | null>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                params.delete(key);
            } else {
                params.set(key, String(value));
            }
        });

        const newParams = params.toString();
        const query = newParams ? `?${newParams}` : "";
        router.push(`${window.location.pathname}${query}`, { scroll: false });
    }, [searchParams, router]);

    const setCurrentSearch = useCallback((value: string) => {
        updateSearchParams({ search: value || null, page: 1 });
    }, [updateSearchParams]);

    const setPageParam = useCallback((value: number) => {
        updateSearchParams({ page: value });
    }, [updateSearchParams]);

    const setTotalItemsParam = useCallback((value: number) => {
        updateSearchParams({ totalItems: value, page: 1 });
    }, [updateSearchParams]);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [viewId, setViewId] = useState<string | number>("0");

    const handleView = (id: string | number) => {
        setViewId(id);
        setDialogOpen(true);
    };


    // edit data
    const handleEdit = (id: string | number) => {
        router.push(`user/form?userId=${id}`);
    };

    // soft delete
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | string | null>(null);
    const handleDelete = (id: string | number) => {
        setDeleteTargetId(id);
        setConfirmDialogOpen(true);
    };
    const handleConfirmDelete = async () => {
        if (!deleteTargetId) return;

        try {
            const savePromise = fetch(`/api/user/${deleteTargetId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: "delete",  // ส่งข้อมูล status ไปใน request body
                }),
            }).then(async (res) => {
                if (!res.ok) {
                    throw new Error('บันทึกข้อมูลไม่สำเร็จ');
                }
                await mutate();  // รีเฟรชข้อมูลหลังจากลบ
            });

            toast.promise(savePromise, {
                loading: 'กำลังบันทึกข้อมูล...',
                success: 'ลบข้อมูลเรียบร้อยแล้ว',
                error: 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่',
            });
        } catch (err) {
            console.error(err);
        } finally {
            setConfirmDialogOpen(false);  // ปิดกล่องยืนยัน
            setDeleteTargetId(null);  // รีเซ็ต ID
        }
    };

    const columns = getColumns({
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
    });

    return (
        <>
            <DataTable
                columns={columns}
                data={youths.items}
                isLoading={isLoading}
                search={search}
                onSearchChange={setCurrentSearch}
                totalPages={youths.totalPages}
                currentPage={page}
                onPageChange={setPageParam}
                totalItems={totalItems}
                onTotalItemsChange={setTotalItemsParam}
            />
            <UserViewDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                viewId={viewId}
            />
            <ConfirmDialog
                open={confirmDialogOpen}
                onOpenChange={setConfirmDialogOpen}
                title="ต้องการลบผู้ใช้นี้ ?"
                description="การดำเนินการนี้ไม่สามารถย้อนกลับได้"
                confirmText="ยืนยัน"
                cancelText="ยกเลิก"
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
