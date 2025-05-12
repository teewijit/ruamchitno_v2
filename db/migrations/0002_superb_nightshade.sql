ALTER TABLE "users" ALTER COLUMN "status" SET DEFAULT 'inactive';--> statement-breakpoint
ALTER TABLE "youths" ADD COLUMN "zip_code" varchar(5);--> statement-breakpoint
ALTER TABLE "youths" ADD COLUMN "full_address" text;