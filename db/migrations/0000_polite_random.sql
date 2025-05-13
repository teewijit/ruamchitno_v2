CREATE TYPE "public"."action_enum" AS ENUM('create', 'update', 'delete');--> statement-breakpoint
CREATE TYPE "public"."classLevel_enum" AS ENUM('ปฐมวัย', 'ประถมศึกษา', 'มัธยมศึกษา', 'อาชีวศึกษา', 'อุดมศึกษา', 'สามเณร', 'เด็กก่อนวัยเรียน', 'วิชาชีพระยะสั้น', 'การศึกษานอกระบบ');--> statement-breakpoint
CREATE TYPE "public"."fundType_enum" AS ENUM('กองทุนถาวร', 'กองทุนรายปี', 'กองทุนบรมราชาภิเษก', 'สมทบทุนทั่วไป', 'กิจกรรม');--> statement-breakpoint
CREATE TYPE "public"."role_enum" AS ENUM('user', 'admin', 'manager');--> statement-breakpoint
CREATE TYPE "public"."status_enum" AS ENUM('active', 'inactive', 'delete');--> statement-breakpoint
CREATE TABLE "affiliations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" varchar(100) NOT NULL,
	"action" "action_enum" NOT NULL,
	"record_id" integer NOT NULL,
	"performed_by" integer NOT NULL,
	"performed_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_name" varchar(100) NOT NULL,
	"class_level" "classLevel_enum" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fund_yearly_amounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"fund_id" integer NOT NULL,
	"year" varchar(4) NOT NULL,
	"donated_amount" numeric(15, 2) DEFAULT '0.00',
	"used_amount" numeric(15, 2) DEFAULT '0.00',
	"remaining_amount" numeric(15, 2) DEFAULT '0.00',
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "funds" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"fund_type" "fundType_enum" NOT NULL,
	"phone" varchar(20),
	"fex" varchar(20),
	"email" varchar(255),
	"address" text,
	"tambon" varchar(255),
	"amphoe" varchar(255),
	"province" varchar(255),
	"initial_amount" numeric(15, 2) DEFAULT '0.00',
	"donated_amount" numeric(15, 2) DEFAULT '0.00',
	"used_amount" numeric(15, 2) DEFAULT '0.00',
	"remaining_amount" numeric(15, 2) DEFAULT '0.00',
	"remark" text,
	"status" "status_enum" DEFAULT 'active' NOT NULL,
	"first_donate_year" varchar(10),
	"last_donate_year" varchar(10),
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "amphoes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"province_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "provinces" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tambons" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"amphoe_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "schools" (
	"id" serial PRIMARY KEY NOT NULL,
	"aff_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20),
	"fex" varchar(20),
	"email" varchar(255),
	"address" text,
	"tambon" varchar(255),
	"amphoe" varchar(255),
	"province" varchar(255),
	"remark" text,
	"status" "status_enum" DEFAULT 'active' NOT NULL,
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"p_name" varchar(100),
	"f_name" varchar(100),
	"l_name" varchar(100),
	"fullname" varchar(255),
	"role" "role_enum" DEFAULT 'user' NOT NULL,
	"status" "status_enum" DEFAULT 'inactive' NOT NULL,
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "youth_fund" (
	"id" serial PRIMARY KEY NOT NULL,
	"p_name" varchar(100),
	"f_name" varchar(100),
	"l_name" varchar(100),
	"full_name" varchar(255),
	"youth_id" integer,
	"fund_id" integer,
	"class_id" integer,
	"academic_year" varchar(10),
	"note" text,
	"remark" text,
	"status" "status_enum" DEFAULT 'active' NOT NULL,
	"gpa" numeric(3, 2) DEFAULT '0.00',
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "youths" (
	"id" serial PRIMARY KEY NOT NULL,
	"citizen_id" varchar(20) DEFAULT '-',
	"email" varchar(255),
	"p_name" varchar(100),
	"f_name" varchar(100),
	"l_name" varchar(100),
	"full_name" varchar(255),
	"phone" varchar(20),
	"address" text,
	"tambon" integer DEFAULT 0,
	"amphoe" integer DEFAULT 0,
	"province" integer DEFAULT 0,
	"zip_code" varchar(5),
	"full_address" text,
	"year_start" varchar(10),
	"class_id" integer DEFAULT 0,
	"remark" text,
	"status" "status_enum" DEFAULT 'active' NOT NULL,
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "fund_yearly_amounts" ADD CONSTRAINT "fund_yearly_amounts_fund_id_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."funds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "amphoes" ADD CONSTRAINT "amphoes_province_id_provinces_id_fk" FOREIGN KEY ("province_id") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tambons" ADD CONSTRAINT "tambons_amphoe_id_amphoes_id_fk" FOREIGN KEY ("amphoe_id") REFERENCES "public"."amphoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_aff_id_affiliations_id_fk" FOREIGN KEY ("aff_id") REFERENCES "public"."affiliations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youth_fund" ADD CONSTRAINT "youth_fund_youth_id_youths_id_fk" FOREIGN KEY ("youth_id") REFERENCES "public"."youths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youth_fund" ADD CONSTRAINT "youth_fund_fund_id_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."funds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youth_fund" ADD CONSTRAINT "youth_fund_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youths" ADD CONSTRAINT "youths_tambon_tambons_id_fk" FOREIGN KEY ("tambon") REFERENCES "public"."tambons"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youths" ADD CONSTRAINT "youths_amphoe_amphoes_id_fk" FOREIGN KEY ("amphoe") REFERENCES "public"."amphoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youths" ADD CONSTRAINT "youths_province_provinces_id_fk" FOREIGN KEY ("province") REFERENCES "public"."provinces"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youths" ADD CONSTRAINT "youths_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;