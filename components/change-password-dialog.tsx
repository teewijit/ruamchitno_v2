"use client";

import ChangePasswordForm, { PasswordSchemaType } from "@/app/admin/user/form/change-password-form";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog";

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    isLoading?: boolean;
    onSubmit: (data: PasswordSchemaType) => void;
};

export default function ChangePasswordDialog({
    open,
    onOpenChange,
    isLoading = false,
    onSubmit,
}: Props) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>เปลี่ยนรหัสผ่าน</AlertDialogTitle>
                    <AlertDialogDescription>
                        กรุณากรอกรหัสผ่านใหม่และยืนยันรหัสผ่าน
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <ChangePasswordForm
                    isLoading={isLoading}
                    onSubmit={onSubmit}
                    onCancel={() => onOpenChange(false)}
                />
            </AlertDialogContent>
        </AlertDialog>
    );
}
