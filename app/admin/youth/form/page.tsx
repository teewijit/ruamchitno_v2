'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from 'next/link';
import { toast } from 'sonner';
import YouthForm from './youth-form';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function YouthFormPage() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");

    const router = useRouter();

    const { data: user, error, isLoading, mutate } = useSWR(
        userId ? `/api/youth/${userId}` : null,
        fetcher
    );

    const handleFormSubmit = async (data: any) => {
        const url = userId
            ? `/api/youth/${userId}`
            : `/api/youth`;

        const method = userId ? "PUT" : "POST";

        const savePromise = fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        }).then(async (res) => {
            if (!res.ok) {
                throw new Error('บันทึกข้อมูลไม่สำเร็จ');
            }
            await mutate();
        });

        toast.promise(savePromise, {
            loading: 'กำลังบันทึกข้อมูล...',
            success: userId ? 'แก้ไขข้อมูลเรียบร้อยแล้ว' : 'บันทึกข้อมูลเรียบร้อยแล้ว',
            error: 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่',
        });

        savePromise.then(() => {
            router.push(`/admin/user`);
        });
    };

    // class
    const { data: classes, error: errorClass, isLoading: loadingClass } = useSWR(
        `/api/class`,
        fetcher
    );

    return (
        <ContentLayout title="เยาวชน">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbLink asChild>
                        <Link href="/admin/user">ข้อมูลเยาวชน</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{userId ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {(userId && !user && !isLoading) ? (
                <div className="text-center text-muted-foreground mt-6">ไม่พบข้อมูลเยาวชน</div>
            ) : (
                <YouthForm
                    youth={user}
                    isLoading={isLoading}
                    mode={userId ? 'edit' : 'create'}
                    onSubmit={handleFormSubmit}
                    classes={classes?.items}
                />
            )}
        </ContentLayout>
    );

}
