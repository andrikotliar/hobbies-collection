DROP TABLE "books_collections" CASCADE;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "first_book_id" integer;--> statement-breakpoint
ALTER TABLE "books" ADD COLUMN "series_order" integer;