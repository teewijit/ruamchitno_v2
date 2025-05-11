"use client";

import { DataTable } from "@/components/table/data-table";
import { getColumns } from "./columns";
import { useSearchParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { useCallback, useState } from "react";
import { UserViewDialog } from "../(dialog)/user-view-dialog";
import { useSession } from "next-auth/react";

// ดึงข้อมูลผ่าน fetcher
const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
};

const DEFAULT_PAGE = 1;
const DEFAULT_TOTAL_ITEMS = 10;

export default function UserTable() {
    const { data: session, status } = useSession();
    console.log(session);
    

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

    // ✅ ใช้ useSWR เพื่อ fetch ข้อมูล
    const { data: users = { items: [], totalPages: 1 }, isLoading, error } = useSWR(
        `/api/user/list?${queryString}`,
        fetcher
    );

    // ✅ ฟังก์ชันอัปเดต URL
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
    const [viewData, setViewData] = useState<any>(null);

    const handleView = (id: string | number) => {
        setViewData({ id });
        setDialogOpen(true);
    };

    const handleEdit = (id: string | number) => {
        router.push(`/user/form?userId=${id}`);
    };

    const handleDelete = (id: string | number) => {
        if (confirm("แน่ใจว่าจะลบ?")) {
            console.log("Delete user", id);
            // เพิ่ม logic ลบ
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
                data={users.items}
                isLoading={isLoading}
                search={search}
                onSearchChange={setCurrentSearch}
                totalPages={users.totalPages}
                currentPage={page}
                onPageChange={setPageParam}
                totalItems={totalItems}
                onTotalItemsChange={setTotalItemsParam}
            />
            <UserViewDialog
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                viewData={viewData}
            />
        </>
    );
}
