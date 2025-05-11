'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from 'swr';
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { BackButton } from '@/components/ui/back-button';
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
import UserForm from './user-form';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function UserFormPage() {
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const router = useRouter();

    const { data: user, error, isLoading, mutate } = useSWR(
        userId ? `/api/user/${userId}` : null,
        fetcher
    );

    const handleSubmit = async (formData: any) => {
        console.log(formData);
        
        // const url = userId
        //     ? `http://localhost:3000/api/users/${userId}`
        //     : `http://localhost:3000/api/users`;
    
        // const method = userId ? "PUT" : "POST";
    
        // const savePromise = fetch(url, {
        //     method,
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify(formData)
        // }).then(async (res) => {
        //     if (!res.ok) {
        //         throw new Error('บันทึกข้อมูลไม่สำเร็จ');
        //     }
        //     await mutate(); 
        // });
    
        // toast.promise(savePromise, {
        //     loading: 'กำลังบันทึกข้อมูล...',
        //     success: userId ? 'แก้ไขข้อมูลผู้ใช้งานเรียบร้อยแล้ว' : 'สร้างข้อมูลผู้ใช้งานเรียบร้อยแล้ว',
        //     error: 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่',
        // });
    
        // savePromise.then(() => {
        //     router.push(`/user`);
        // });
    };
    

    return (
        <ContentLayout title="เยาวชน">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbLink asChild>
                        <Link href="/admin/user">ข้อมูลผู้ใช้งาน</Link>
                    </BreadcrumbLink>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{userId ? "แก้ไขข้อมูล" : "เพิ่มข้อมูล"}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <UserForm
                user={user}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                mode={userId ? 'edit' : 'create'}
            />
        </ContentLayout>
    );
}
