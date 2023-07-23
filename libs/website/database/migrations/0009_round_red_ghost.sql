ALTER TABLE "page" ADD COLUMN "accent_color" varchar(7);--> statement-breakpoint
ALTER TABLE "profile" DROP COLUMN IF EXISTS "accent_color";