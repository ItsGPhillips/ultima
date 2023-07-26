CREATE TABLE IF NOT EXISTS "post_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"handle" text NOT NULL,
	"post_id" varchar(24) NOT NULL,
	"parent_id" integer,
	"comment" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "votes" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_handle_page_handle_fk" FOREIGN KEY ("handle") REFERENCES "page"("handle") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_parent_id_post_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "post_comments"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
