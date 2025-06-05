"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { InputWithLabel } from "@/components/inputs/input-label";
import { SelectWithLabel } from "@/components/inputs/select-label";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { BackButton } from '@/components/ui/back-button';
import { useEffect, useState } from "react";
import { TextAreaWithLabel } from "@/components/inputs/input-textarea";
import { SelectWithSearch } from "@/components/inputs/select-search";

import {
    getAllProvinces,
    getAmphoesByProvinceId,
    getTambonsByAmphoeId,
    getZipCodeByTambonId,
} from '@/services/location.service';
import Loading from "./loading";
import { optionsTitle } from "@/lib/titles";

type Option = {
    value: number;
    label: string
}

const insertSchema = z.object({
    citizen_id: z.string().optional(),
    email: z.string().optional(),
    p_name: z.string().min(1, "กรุณากรอกคำนำหน้า"),
    f_name: z.string().min(1, "กรุณากรอกชื่อจริง"),
    l_name: z.string().min(1, "กรุณากรอกนามสกุล"),
    phone: z.string().optional(),
    address: z.string().optional(),
    tambon: z.number().min(1, "กรุณาเลือก แขวง/ตำบล"),
    amphoe: z.number().min(1, "กรุณาเลือก เขต/อำเภอ"),
    province: z.number().min(1, "กรุณาเลือกจังหวัด"),
    zip_code: z.string()
        .regex(/^\d{5}$/, "รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก")
        .optional(),
    year_start: z.string().optional(),
    class_id: z.coerce.number().optional(),
    remark: z.string().optional(),
    status: z.enum(["active", "inactive"]).default("active").optional(),
});

const updateSchema = insertSchema;

type InsertSchemaType = z.infer<typeof insertSchema>;
type UpdateSchemaType = z.infer<typeof updateSchema>;

type Props = {
    youth?: InsertSchemaType | UpdateSchemaType,
    isLoading?: boolean,
    mode: "create" | "edit",
    classes?: { id: number, short_name: string }[],
    onSubmit: (data: InsertSchemaType | UpdateSchemaType) => void
};

export default function YouthForm({
    youth,
    isLoading = false,
    mode,
    classes = [],
    onSubmit
}: Props) {
    const schema = mode === "create" ? insertSchema : updateSchema;

    const form = useForm<InsertSchemaType | UpdateSchemaType>({
        defaultValues: youth ?? {
            citizen_id: '',
            email: '',
            f_name: '',
            l_name: '',
            p_name: '',
            phone: '',
            address: '',
            tambon: 0,
            amphoe: 0,
            province: 0,
            zip_code: '',
            year_start: '',
            class_id: undefined,
            remark: '',
            status: 'active'
        },
        resolver: zodResolver(schema),
        mode: "onBlur"
    });

    useEffect(() => {
        if (youth) {
            form.reset(youth);
        }
    }, [youth]);

    const handleSubmit = async (data: InsertSchemaType | UpdateSchemaType) => {
        onSubmit(data);
    };

    const [selectedProvince, setSelectedProvince] = useState<number>(0);
    const [selectedAmphoe, setSelectedAmphoe] = useState<number>(0);
    const [optionsProvince, setOptionsProvince] = useState<Option[]>([]);
    const [optionsAmphoe, setOptionsAmphoe] = useState<Option[]>([]);
    const [optionsTambon, setOptionsTambon] = useState<Option[]>([]);

    // ฟังก์ชันที่จะถูกเรียกเมื่อเลือกจังหวัด
    function onChangeProvince(selected: Option | undefined) {

        if (selected) {
            setSelectedProvince(selected.value);
            // รีเซ็ตค่าอำเภอและตำบลเมื่อเปลี่ยนจังหวัด
            setSelectedAmphoe(0);
            form.setValue("amphoe", 0);
            form.setValue("tambon", 0);
            form.setValue("zip_code", "");
        } else {
            setSelectedProvince(0);
        }
    }

    // ฟังก์ชันที่จะถูกเรียกเมื่อเลือกอำเภอ
    function onChangeAmphoe(selected: Option | undefined) {
        if (selected) {
            setSelectedAmphoe(selected.value);
            // รีเซ็ตค่าตำบลเมื่อเปลี่ยนอำเภอ
            form.setValue("tambon", 0);
        } else {
            setSelectedAmphoe(0);
        }
    }

    // ฟังก์ชันที่จะถูกเรียกเมื่อเลือกตำบลแล้วจะใส่ zip_code อัติโนมัต
    function onChangeTambon(selected: Option | undefined) {
        if (selected) {
            form.setValue("zip_code", getZipCodeByTambonId(selected.value));
        }
    }

    // โหลดข้อมูลจังหวัดเมื่อ component ถูกโหลด
    useEffect(() => {
        const optsProvince: Option[] = getAllProvinces();
        setOptionsProvince(optsProvince);
    }, []);

    // กรองข้อมูลอำเภอเมื่อเลือกจังหวัด
    useEffect(() => {
        if (selectedProvince) {
            const filteredAmphoe = getAmphoesByProvinceId(selectedProvince)
            setOptionsAmphoe(filteredAmphoe);
            setOptionsTambon([]);
        } else {
            setOptionsAmphoe([]);
            setOptionsTambon([]);
        }
    }, [selectedProvince]);

    // กรองข้อมูลตำบลเมื่อเลือกอำเภอ
    useEffect(() => {
        if (selectedAmphoe) {
            const filteredTambon = getTambonsByAmphoeId(selectedAmphoe)
            setOptionsTambon(filteredTambon);
        } else {
            setOptionsTambon([]);
        }
    }, [selectedAmphoe]);

    return (
        <Card className="rounded-lg border-none mt-6">
            <CardContent>
                {isLoading ? (
                    <Loading />
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12 md:col-span-4">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="เลขประจำตัวประชาชน"
                                        nameInSchema="citizen_id"
                                        maxLength={13}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-4">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="อีเมล"
                                        nameInSchema="email"
                                    />
                                </div>

                                <div className="col-span-12 md:col-span-2">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="ปีที่เริ่ม"
                                        nameInSchema="year_start"
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-2">
                                    <SelectWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="ชั้นที่เริ่ม"
                                        nameInSchema="class_id"
                                        placeholder="เลือกชั้นเรียน"
                                        data={
                                            classes.map(cls => ({
                                                value: String(cls.id),
                                                label: cls.short_name
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-4 md:col-span-2">
                                    <SelectWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="คำนำหน้า"
                                        nameInSchema="p_name"
                                        placeholder="เลือกคำนำหน้า"
                                        data={optionsTitle}
                                    ></SelectWithLabel>
                                </div>

                                <div className="col-span-8 md:col-span-5">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="ชื่อจริง"
                                        nameInSchema="f_name"
                                    />
                                </div>

                                <div className="col-span-12 md:col-span-5">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="นามสกุล"
                                        nameInSchema="l_name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1">
                                <TextAreaWithLabel<InsertSchemaType | UpdateSchemaType>
                                    fieldTitle="ที่อยู่"
                                    nameInSchema="address"
                                />
                            </div>

                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12 md:col-span-4">
                                    <SelectWithSearch<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="จังหวัด"
                                        nameInSchema="province"
                                        placeholder="เลือกจังหวัด"
                                        data={optionsProvince}
                                        onChange={onChangeProvince}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-4">
                                    <SelectWithSearch<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="อำเภอ"
                                        nameInSchema="amphoe"
                                        placeholder="เลือกอำเภอ"
                                        data={optionsAmphoe}
                                        disabled={!selectedProvince}
                                        onChange={onChangeAmphoe}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-4">
                                    <SelectWithSearch<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="ตำบล"
                                        nameInSchema="tambon"
                                        placeholder="เลือกตำบล"
                                        data={optionsTambon}
                                        disabled={!selectedAmphoe}
                                        onChange={onChangeTambon}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-12 gap-4">
                                <div className="col-span-12 md:col-span-6">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="รหัสไปรษณีย์"
                                        nameInSchema="zip_code"
                                        maxLength={5}
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-6">
                                    <InputWithLabel<InsertSchemaType | UpdateSchemaType>
                                        fieldTitle="เบอร์โทรศัพท์"
                                        nameInSchema="phone"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1">
                                <TextAreaWithLabel<InsertSchemaType | UpdateSchemaType>
                                    fieldTitle="หมายเหตุ"
                                    nameInSchema="remark"
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <BackButton title="ย้อนกลับ" variant={"outline"} />
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    variant={"default"}
                                >
                                    {isLoading
                                        ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                )}
            </CardContent>
        </Card>
    )
}