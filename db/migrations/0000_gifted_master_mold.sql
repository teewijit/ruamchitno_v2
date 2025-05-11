CREATE TYPE "public"."action" AS ENUM('create', 'update', 'delete');--> statement-breakpoint
CREATE TYPE "public"."classLevel" AS ENUM('ปฐมวัย', 'ประถมศึกษา', 'มัธยมศึกษา', 'อาชีวศึกษา', 'อุดมศึกษา', 'สามเณร', 'เด็กก่อนวัยเรียน', 'วิชาชีพระยะสั้น', 'การศึกษานอกระบบ');--> statement-breakpoint
CREATE TYPE "public"."fundType" AS ENUM('กองทุนถาวร', 'กองทุนรายปี', 'กองทุนบรมราชาภิเษก', 'สมทบทุนทั่วไป', 'กิจกรรม');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('user', 'admin', 'manager');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'delete');--> statement-breakpoint
CREATE TABLE "affiliations" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_name" varchar(100) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"table_name" varchar(100) NOT NULL,
	"action" "action" NOT NULL,
	"record_id" integer NOT NULL,
	"performed_by" integer NOT NULL,
	"performed_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"short_name" varchar(100) NOT NULL,
	"class_level" "classLevel" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fund_yearly_amounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"fund_id" integer NOT NULL,
	"year" varchar(4) NOT NULL,
	"donated_amount" numeric(15, 2) DEFAULT '0.00',
	"used_amount" numeric(15, 2) DEFAULT '0.00',
	"remaining_amount" numeric(15, 2) DEFAULT '0.00'
);
--> statement-breakpoint
CREATE TABLE "funds" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"fund_type" "fundType" NOT NULL,
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
	"status" "status" DEFAULT 'active' NOT NULL,
	"first_donate_year" varchar(10),
	"last_donate_year" varchar(10),
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now()
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
	"status" "status" DEFAULT 'active' NOT NULL,
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
	"role" "role" DEFAULT 'user' NOT NULL,
	"status" "status" DEFAULT 'active' NOT NULL,
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
	"status" "status" DEFAULT 'active' NOT NULL,
	"gpa" numeric(3, 2) DEFAULT '0.00',
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "youths" (
	"id" serial PRIMARY KEY NOT NULL,
	"citizen_id" varchar(20),
	"email" varchar(255),
	"p_name" varchar(100),
	"f_name" varchar(100),
	"l_name" varchar(100),
	"full_name" varchar(255),
	"phone" varchar(20),
	"address" text,
	"tambon" varchar(255),
	"amphoe" varchar(255),
	"province" varchar(255),
	"year_start" varchar(10),
	"class_id" integer,
	"remark" text,
	"status" "status" DEFAULT 'active' NOT NULL,
	"create_at" timestamp with time zone DEFAULT now(),
	"update_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "fund_yearly_amounts" ADD CONSTRAINT "fund_yearly_amounts_fund_id_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."funds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schools" ADD CONSTRAINT "schools_aff_id_affiliations_id_fk" FOREIGN KEY ("aff_id") REFERENCES "public"."affiliations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youth_fund" ADD CONSTRAINT "youth_fund_youth_id_youths_id_fk" FOREIGN KEY ("youth_id") REFERENCES "public"."youths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youth_fund" ADD CONSTRAINT "youth_fund_fund_id_funds_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."funds"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youth_fund" ADD CONSTRAINT "youth_fund_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "youths" ADD CONSTRAINT "youths_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;