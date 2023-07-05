ALTER TABLE "auth"."key" DROP CONSTRAINT "key_user_id_user_id_fk";

ALTER TABLE "auth"."session" DROP CONSTRAINT "session_user_id_user_id_fk";

DO $$ BEGIN
 ALTER TABLE "auth"."key" ADD CONSTRAINT "key_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
