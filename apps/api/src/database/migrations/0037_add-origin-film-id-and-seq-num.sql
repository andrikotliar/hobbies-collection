ALTER TABLE "films" ADD COLUMN "origin_film_id" integer;--> statement-breakpoint
ALTER TABLE "films" ADD COLUMN "sequence_number" numeric DEFAULT 1 NOT NULL;