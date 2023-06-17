CREATE TABLE IF NOT EXISTS "group" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"is_private" boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS "group_badge" (
	"group_id" text NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "group_badge" ADD CONSTRAINT "group_badge_group_id_name" PRIMARY KEY("group_id","name");

CREATE TABLE IF NOT EXISTS "post" (
	"id" varchar(24) PRIMARY KEY NOT NULL,
	"group_id" text NOT NULL,
	"profile_handle" text NOT NULL,
	"posted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"body" text
);

CREATE TABLE IF NOT EXISTS "post_votes" (
	"post_id" varchar(24) NOT NULL,
	"group_id" text NOT NULL,
	"profile_handle" text NOT NULL,
	"is_upvote" boolean NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_post_id_group_id" PRIMARY KEY("post_id","group_id");

CREATE TABLE IF NOT EXISTS "profile" (
	"handle" text PRIMARY KEY NOT NULL,
	"clerk_user_id" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "subscription" (
	"page_id" text NOT NULL,
	"profile_handle" text NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_page_id_profile_handle" PRIMARY KEY("page_id","profile_handle");

CREATE INDEX IF NOT EXISTS "badge_page_idx" ON "group_badge" ("group_id");
DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "post" ADD CONSTRAINT "post_profile_handle_profile_handle_fk" FOREIGN KEY ("profile_handle") REFERENCES "profile"("handle") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_group_id_group_id_fk" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "post_votes" ADD CONSTRAINT "post_votes_profile_handle_profile_handle_fk" FOREIGN KEY ("profile_handle") REFERENCES "profile"("handle") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_page_id_group_id_fk" FOREIGN KEY ("page_id") REFERENCES "group"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "subscription" ADD CONSTRAINT "subscription_profile_handle_profile_handle_fk" FOREIGN KEY ("profile_handle") REFERENCES "profile"("handle") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
