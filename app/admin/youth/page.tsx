"use client"

import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import UserTable from "./(table)/user-table";

export default function UserPage() {

    return (
        <ContentLayout title="เยาวชน">
            <div className="flex items-center justify-between">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>ข้อมูลเยาวชน</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                            <Link href="/user/form" className={buttonVariants({ variant: "outline", size: 'icon' })}>
                                <Plus />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>เพิ่มข้อมูลเยาวชน</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>

            <Card className="rounded-lg border-none mt-6">
                <CardContent className="p-6">
                    <UserTable />
                </CardContent>
            </Card>

        </ContentLayout>
    );
}
