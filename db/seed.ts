import { db } from "../db"; // ปรับ path ตาม db config จริง
import { amphoes, provinces, tambons } from "./schema/location.schema";
import provincesData from '@/lib/thailand-province-data/provinces.json';
import amphoesData from '@/lib/thailand-province-data/amphoes.json';
import tambonsData from '@/lib/thailand-province-data/tambons.json';
import { classes } from "./schema/class.schema";
import { affiliations } from "./schema/affiliation.schema";

type ProvinceJson = {
  id: number;
  name_th: string;
};

type AmphoeJson = {
  id: number;
  name_th: string;
  province_id: number;
};

type TambonJson = {
  id: number;
  name_th: string;
  amphoe_id: number;
};

async function seedLocation() {
  try {
    console.log("🌱 เริ่ม seed ข้อมูล location");

    // Seed provinces
    const provincesToInsert = (provincesData as ProvinceJson[]).map((item) => ({
      id: item.id,
      name: item.name_th,
    }));
    await db.insert(provinces).values(provincesToInsert).onConflictDoNothing();

    // Seed amphoes
    const amphoesToInsert = (amphoesData as AmphoeJson[]).map((item) => ({
      id: item.id,
      name: item.name_th,
      province_id: item.province_id,
    }));
    await db.insert(amphoes).values(amphoesToInsert).onConflictDoNothing();

    // สร้าง Set ของ amphoe_id ที่มีอยู่จริง
    const validAmphoeIds = new Set(amphoesToInsert.map((a) => a.id));

    // Seed tambons (กรองเฉพาะ amphoe_id ที่มีอยู่ใน amphoes)
    const tambonsToInsert = (tambonsData as TambonJson[]).filter((item) =>
      validAmphoeIds.has(item.amphoe_id)
    ).map((item) => ({
      id: item.id,
      name: item.name_th,
      amphoe_id: item.amphoe_id,
    }));

    const skippedTambons = (tambonsData as TambonJson[]).length - tambonsToInsert.length;
    if (skippedTambons > 0) {
      console.warn(`⚠️ ข้าม tambons ${skippedTambons} รายการที่ไม่พบ amphoe_id ที่เกี่ยวข้อง`);
    }

    await db.insert(tambons).values(tambonsToInsert).onConflictDoNothing();

    console.log("✅ เสร็จสิ้นการ seed ข้อมูล location");
  } catch (err) {
    console.error("❌ เกิดข้อผิดพลาดในการ seed:", err);
    process.exit(1); // หยุดการทำงานหากเกิดข้อผิดพลาด
  }
}

type ClassLevel =
  | "ปฐมวัย"
  | "ประถมศึกษา"
  | "มัธยมศึกษา"
  | "อาชีวศึกษา"
  | "อุดมศึกษา"
  | "สามเณร"
  | "เด็กก่อนวัยเรียน"
  | "วิชาชีพระยะสั้น"
  | "การศึกษานอกระบบ";

interface classesDataType {
  id: number;
  name: string;
  short_name: string;
  class_level: ClassLevel;
}

async function seedClasses() {
  const classesData: classesDataType[] = [
    { id: 1, name: 'อนุบาล 1', short_name: 'อ.1', class_level: 'ปฐมวัย' },
    { id: 2, name: 'อนุบาล 2', short_name: 'อ.2', class_level: 'ปฐมวัย' },
    { id: 3, name: 'อนุบาล 3', short_name: 'อ.3', class_level: 'ปฐมวัย' },
    { id: 4, name: 'ประถมศึกษาปีที่ 1', short_name: 'ป.1', class_level: 'ประถมศึกษา' },
    { id: 5, name: 'ประถมศึกษาปีที่ 2', short_name: 'ป.2', class_level: 'ประถมศึกษา' },
    { id: 6, name: 'ประถมศึกษาปีที่ 3', short_name: 'ป.3', class_level: 'ประถมศึกษา' },
    { id: 7, name: 'ประถมศึกษาปีที่ 4', short_name: 'ป.4', class_level: 'ประถมศึกษา' },
    { id: 8, name: 'ประถมศึกษาปีที่ 5', short_name: 'ป.5', class_level: 'ประถมศึกษา' },
    { id: 9, name: 'ประถมศึกษาปีที่ 6', short_name: 'ป.6', class_level: 'ประถมศึกษา' },
    { id: 10, name: 'มัธยมศึกษาปีที่ 1', short_name: 'ม.1', class_level: 'มัธยมศึกษา' },
    { id: 11, name: 'มัธยมศึกษาปีที่ 2', short_name: 'ม.2', class_level: 'มัธยมศึกษา' },
    { id: 12, name: 'มัธยมศึกษาปีที่ 3', short_name: 'ม.3', class_level: 'มัธยมศึกษา' },
    { id: 13, name: 'มัธยมศึกษาปีที่ 4', short_name: 'ม.4', class_level: 'มัธยมศึกษา' },
    { id: 14, name: 'มัธยมศึกษาปีที่ 5', short_name: 'ม.5', class_level: 'มัธยมศึกษา' },
    { id: 15, name: 'มัธยมศึกษาปีที่ 6', short_name: 'ม.6', class_level: 'มัธยมศึกษา' },
    { id: 16, name: 'ประกาศนียบัตรวิชาชีพปีที่ 1', short_name: 'ปวช.1', class_level: 'อาชีวศึกษา' },
    { id: 17, name: 'ประกาศนียบัตรวิชาชีพปีที่ 2', short_name: 'ปวช.2', class_level: 'อาชีวศึกษา' },
    { id: 18, name: 'ประกาศนียบัตรวิชาชีพปีที่ 3', short_name: 'ปวช.3', class_level: 'อาชีวศึกษา' },
    { id: 19, name: 'ประกาศนียบัตรวิชาชีพชั้นสูง ปีที่ 1', short_name: 'ปวส.1', class_level: 'อุดมศึกษา' },
    { id: 20, name: 'ประกาศนียบัตรวิชาชีพชั้นสูง ปีที่ 2', short_name: 'ปวส.2', class_level: 'อุดมศึกษา' },
    { id: 21, name: 'ปริญญาตรี ปีที่ 1', short_name: 'ป.ตรี 1', class_level: 'อุดมศึกษา' },
    { id: 22, name: 'ปริญญาตรี ปีที่ 2', short_name: 'ป.ตรี 2', class_level: 'อุดมศึกษา' },
    { id: 23, name: 'ปริญญาตรี ปีที่ 3', short_name: 'ป.ตรี 3', class_level: 'อุดมศึกษา' },
    { id: 24, name: 'ปริญญาตรี ปีที่ 4', short_name: 'ป.ตรี 4', class_level: 'อุดมศึกษา' },
    { id: 25, name: 'ปริญญาตรี ปีที่ 5', short_name: 'ป.ตรี 5', class_level: 'อุดมศึกษา' },
    { id: 26, name: 'ปริญญาตรี ปีที่ 6', short_name: 'ป.ตรี 6', class_level: 'อุดมศึกษา' },
    { id: 27, name: 'ปริญญาโท ปีที่ 1', short_name: 'ป.โท 1', class_level: 'อุดมศึกษา' },
    { id: 28, name: 'ปริญญาโท ปีที่ 2', short_name: 'ป.โท 2', class_level: 'อุดมศึกษา' },
    { id: 29, name: 'ปริญญาโท ปีที่ 3', short_name: 'ป.โท 3', class_level: 'อุดมศึกษา' },
    { id: 30, name: 'สามเณร', short_name: 'สามเณร', class_level: 'สามเณร' },
    { id: 31, name: 'วิชาชีพระยะสั้น', short_name: 'วิชาชีพระยะสั้น', class_level: 'วิชาชีพระยะสั้น' },
    { id: 32, name: 'เด็กก่อนวัยเรียน', short_name: 'เด็กก่อนวัยเรียน', class_level: 'เด็กก่อนวัยเรียน' },
    { id: 33, name: 'มัธยมศึกษาตอนต้น', short_name: 'ม.ต้น', class_level: 'การศึกษานอกระบบ' },
    { id: 34, name: 'มัธยมศึกษาตอนปลาย', short_name: 'ม.ปลาย', class_level: 'การศึกษานอกระบบ' },
  ];

  try {
    console.log("🌱 เริ่ม seed ข้อมูล Classes");
    await db.insert(classes).values(classesData).onConflictDoNothing(); // ใช้ db.insert แทน Class.bulkCreate
    console.log("✅ เสร็จสิ้นการ seed ข้อมูล Classes");
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการ seed:", error);
    process.exit(1);
  }
}

interface affiliationsDataType {
  id: number;
  name: string;
  short_name: string;
}

async function seedAffiliations() {
  const affiliationsData: affiliationsDataType[] = [
    { id: 1, name: 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)', short_name: 'สพฐ.' },
    { id: 2, name: 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐานประถมศึกษา(สพป.)', short_name: 'สพป.' },
    { id: 3, name: 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐานมัธยมศึกษา(สพม.)', short_name: 'สพม.' },
    { id: 4, name: 'กรมการส่งเสริมการปกครองท้องถิ่น (สถ.)', short_name: 'สถ.' },
    { id: 5, name: 'กองบัญชาการตำรวจตระเวนชายแดน (ตชด.)', short_name: 'ตชด.' },
    { id: 6, name: 'สำนักงานการศึกษากรุงเทพมหานคร (กทม.)', short_name: 'กทม.' },
    { id: 7, name: 'สำนักบริหารงานคณะกรรมการส่งเสริมการศึกษาเอกชน (สช.)', short_name: 'สช.' },
    { id: 8, name: 'องค์การบริหารส่วนจังหวัด (อบจ.)', short_name: 'อบจ.' },
    { id: 9, name: 'สำนักส่งเสริมการเรียนรู้จังหวัด (สกร.จ.)', short_name: 'สกร.' },
    { id: 10, name: 'สำนักบริหารงานการศึกษาพิเศษ (สศศ.)', short_name: 'สศศ.' },
    { id: 11, name: 'สถาบันบัณฑิตพัฒนศิลป์ (สบศ.)', short_name: 'สบศ.' },
    { id: 12, name: 'สำนักงานคณะกรรมการอาชีวศึกษา (อศ.)', short_name: 'อศ.' },
    { id: 13, name: 'กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม (อว.)', short_name: 'อว.' },
    { id: 14, name: 'กระทรวงกลาโหม (กห.)', short_name: 'กห.' },
    { id: 15, name: 'กระทรวงสาธารณสุข (สธ.)', short_name: 'สธ.' },
    { id: 16, name: 'กระทรวงการท่องเที่ยวและกีฬา (กก.)', short_name: 'กก.' },
    { id: 17, name: 'กรมการศาสนา (ศน.)', short_name: 'ศน.' },
    { id: 18, name: 'สำนักงานปลัดกระทรวงวัฒนธรรม', short_name: 'วธ.' },
    { id: 19, name: 'สังนักส่งเสริมการเรียนรู้กรุงเทพมหานคร (สกร.กทม.)', short_name: 'สกร.กทม.' },
    { id: 20, name: 'ศูนย์ส่งเสริมการเรียนรู้อำเภอ (ศสกร.อ.)', short_name: 'สกร.' },
    { id: 21, name: 'ศูนย์ส่งเสริมการเรียนรู้เขต (ศสกร.ข.)', short_name: 'สกร.' },
    { id: 22, name: 'สำนักงานคณะกรรมการการศึกษาแห่งชาติ (สกศ.)', short_name: 'สกศ.' },
    { id: 23, name: 'กระทรวงแรงงาน', short_name: 'รง' },
    { id: 24, name: 'องค์การบริหารส่วนตำบล (อบต.)', short_name: 'อบต.' },
    { id: 25, name: 'สำนักการศึกษากรุงเทพมหานคร (สนศ.)', short_name: 'สนศ.' }
  ];

  try {
    console.log("🌱 เริ่ม seed ข้อมูล affiliations");
    await db.insert(affiliations).values(affiliationsData).onConflictDoNothing();
    console.log("✅ เสร็จสิ้นการ seed ข้อมูล affiliations");
  } catch (error) {
    console.error("❌ เกิดข้อผิดพลาดในการ seed:", error);
    process.exit(1);
  }
}


async function runSeeds() {
  await seedLocation();
  await seedClasses();
  await seedAffiliations();
}

runSeeds();