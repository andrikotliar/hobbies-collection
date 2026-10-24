ALTER TABLE "collections" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "films" DROP COLUMN "synopsis";--> statement-breakpoint
ALTER TABLE "films_collections" DROP COLUMN "order";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "translationPreferences";--> statement-breakpoint
DROP TYPE "public"."collection_category";