CREATE TABLE IF NOT EXISTS "user_uploaded_media" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" text NOT NULL,
	"handle" text NOT NULL,
	"url" text NOT NULL,
	"type" text NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "user_uploaded_media" ADD CONSTRAINT "user_uploaded_media_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user_uploaded_media" ADD CONSTRAINT "user_uploaded_media_handle_page_handle_fk" FOREIGN KEY ("handle") REFERENCES "page"("handle") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
