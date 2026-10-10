CREATE TYPE "public"."book_read_status" AS ENUM('READ', 'PLANNED');--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "status" "book_read_status" DEFAULT 'PLANNED' NOT NULL;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "reading_order" numeric NOT NULL;