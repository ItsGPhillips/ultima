CREATE SCHEMA "auth";

CREATE SCHEMA "page";

CREATE SCHEMA "user";

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
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"handle" varchar(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "page"."group" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS "page"."group_badge" (
	"group_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "page"."group_badge" ADD CONSTRAINT "group_badge_group_id_name" PRIMARY KEY("group_id","name");

CREATE TABLE IF NOT EXISTS "user"."post" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"group_id" text NOT NULL,
	"profile_handle" text NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"body" text
);

CREATE TABLE IF NOT EXISTS "user"."post_votes" (
	"post_id" varchar(24) NOT NULL,
	"group_id" text NOT NULL,
	"profile_handle" text NOT NULL,
	"is_upvote" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user"."post_votes" ADD CONSTRAINT "post_votes_post_id_group_id" PRIMARY KEY("post_id","group_id");

CREATE TABLE IF NOT EXISTS "user"."profile" (
	"handle" text PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "user"."subscription" (
	"page_id" text NOT NULL,
	"profile_handle" text NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user"."subscription" ADD CONSTRAINT "subscription_page_id_profile_handle" PRIMARY KEY("page_id","profile_handle");

CREATE INDEX IF NOT EXISTS "handle_idx" ON "auth"."user" ("handle");
CREATE INDEX IF NOT EXISTS "badge_page_idx" ON "page"."group_badge" ("group_id");
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

DO $$ BEGIN
 ALTER TABLE "user"."post" ADD CONSTRAINT "post_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "page"."group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user"."post" ADD CONSTRAINT "post_profile_handle_profile_handle_fk" FOREIGN KEY ("profile_handle") REFERENCES "user"."profile"("handle") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user"."post_votes" ADD CONSTRAINT "post_votes_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "user"."post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user"."post_votes" ADD CONSTRAINT "post_votes_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "page"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user"."post_votes" ADD CONSTRAINT "post_votes_profile_handle_profile_handle_fk" FOREIGN KEY ("profile_handle") REFERENCES "user"."profile"("handle") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user"."profile" ADD CONSTRAINT "profile_handle_user_handle_fk" FOREIGN KEY ("handle") REFERENCES "auth"."user"("handle") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user"."subscription" ADD CONSTRAINT "subscription_page_id_group_id_fk" FOREIGN KEY ("page_id") REFERENCES "page"."group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "user"."subscription" ADD CONSTRAINT "subscription_profile_handle_profile_handle_fk" FOREIGN KEY ("profile_handle") REFERENCES "user"."profile"("handle") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
