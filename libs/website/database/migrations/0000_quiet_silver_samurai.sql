CREATE SCHEMA "auth";

CREATE TABLE IF NOT EXISTS "page" (
	"handle" text PRIMARY KEY NOT NULL,
	"primary_profile_id" text UNIQUE,
	"title" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"details" text DEFAULT '' NOT NULL,
	"allow_external" boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS "page_badge" (
	"handle" text,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "page_badge" ADD CONSTRAINT "page_badge_handle_name" PRIMARY KEY("handle","name");

CREATE TABLE IF NOT EXISTS "page_moderators" (
	"handle" text,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "page_moderators" ADD CONSTRAINT "page_moderators_handle_name" PRIMARY KEY("handle","name");

CREATE TABLE IF NOT EXISTS "post" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"handle" text NOT NULL,
	"poster_handle" text NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"body" text
);

CREATE TABLE IF NOT EXISTS "post_votes" (
	"post_id" varchar(24) NOT NULL,
	"handle" text NOT NULL,
	"is_upvote" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_post_id_handle" PRIMARY KEY("post_id","handle");

CREATE TABLE IF NOT EXISTS "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "public_profile_mask" (
	"profile_id" text PRIMARY KEY NOT NULL,
	"name" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "subscription" (
	"handle" text NOT NULL,
	"profile_id" text NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_handle_profile_id" PRIMARY KEY("handle","profile_id");

CREATE TABLE IF NOT EXISTS "auth"."key" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"primary_key" boolean NOT NULL,
	"hashed_password" varchar(255),
	"expires" bigint
);

CREATE TABLE IF NOT EXISTS "auth"."session" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(15) NOT NULL,
	"active_expires" bigint NOT NULL,
	"idle_expires" bigint NOT NULL
);

CREATE TABLE IF NOT EXISTS "auth"."user" (
	"id" varchar(15) PRIMARY KEY NOT NULL
);

CREATE INDEX IF NOT EXISTS "primary_profile_id_idx" ON "page" ("primary_profile_id");
DO $$ BEGIN
 ALTER TABLE "page" ADD CONSTRAINT "page_primary_profile_id_profile_id_fk" FOREIGN KEY ("primary_profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "page_badge" ADD CONSTRAINT "page_badge_handle_page_handle_fk" FOREIGN KEY ("handle") REFERENCES "page"("handle") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "page_moderators" ADD CONSTRAINT "page_moderators_handle_page_handle_fk" FOREIGN KEY ("handle") REFERENCES "page"("handle") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_handle_page_handle_fk" FOREIGN KEY ("handle") REFERENCES "page"("handle") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_poster_handle_page_handle_fk" FOREIGN KEY ("poster_handle") REFERENCES "page"("handle") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_handle_page_handle_fk" FOREIGN KEY ("handle") REFERENCES "page"("handle") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "public_profile_mask" ADD CONSTRAINT "public_profile_mask_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_handle_page_handle_fk" FOREIGN KEY ("handle") REFERENCES "page"("handle") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "auth"."key" ADD CONSTRAINT "key_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
