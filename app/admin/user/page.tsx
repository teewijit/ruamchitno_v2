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
                            <BreadcrumbPage>ข้อมูลผู้ใช้งาน</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <TooltipProvider>
                    <Tooltip delayDuration={100}>
                        <TooltipTrigger>
                            <Link href="/admin/user/form" className={buttonVariants({ variant: "outline", size: 'icon' })}>
                                <Plus />
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>เพิ่มข้อมูลผู้ใช้งาน</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>

            <Card className="rounded-lg border-none mt-6">
                <CardContent>
                    <UserTable />
                </CardContent>
            </Card>

        </ContentLayout>
    );
}
