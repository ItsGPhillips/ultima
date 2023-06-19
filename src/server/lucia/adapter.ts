import { eq, and } from "drizzle-orm";
import {
   Adapter,
   UserSchema,
   LuciaError,
   SessionSchema,
   KeySchema,
   UserAdapter,
   SessionAdapter,
} from "lucia-auth";
import { Log } from "~/utils/log";
import * as AUTH_SCHEMA from "../database/schema/auth";
import { Auth } from "../database/types";
import { Auth as AuthZod } from "../database/zod";
import { Database, db } from "../database";
import { DatabaseError } from "pg";

const userAdaper: UserAdapter = {
   getUser: async (id: string): Promise<UserSchema | null> => {
      Log.info({ id }, "lucia::getUser");

      const [user] = await db
         .select()
         .from(AUTH_SCHEMA.user)
         .where(eq(AUTH_SCHEMA.user.id, id))
         .limit(1);
      return user ?? null;
   },
   setUser: async (
      id: string,
      attrs: Record<any, any>,
      key: Readonly<KeySchema> | null
   ): Promise<UserSchema | void> => {
      Log.info({ id, key }, "lucia::setUser");

      try {
         if (!key) {
            return await utls.insertUser(db, id, attrs);
         }
         return await db.transaction(async (tx) => {
            const user = await utls.insertUser(tx, id, attrs);
            await utls.insertKey(tx, key);
            return user;
         });
      } catch (e: any) {
         if ("code" in e) {
            switch (e.code) {
               case "23505": {
                  throw new LuciaError("AUTH_DUPLICATE_KEY_ID");
               }
            }
         }
         throw e;
      }
   },
   deleteUser: async (userId: string) => {
      Log.info({ userId }, "lucia::deleteUser");
      await db.delete(AUTH_SCHEMA.user).where(eq(AUTH_SCHEMA.user.id, userId));
   },
   updateUserAttributes: async (
      userId: string,
      unknown_attrs: Record<string, unknown>
   ): Promise<UserSchema> => {
      Log.info({ userId, attr: unknown_attrs }, "lucia::updateUserAttributes");

      const attrs = AuthZod.USER_TABLE_SCHEMA.insert
         .omit({ id: true })
         .parse(unknown_attrs);

      const [user] = await db
         .update(AUTH_SCHEMA.user)
         .set(attrs)
         .where(eq(AUTH_SCHEMA.user.id, userId))
         .returning();

      if (!user) {
         throw new LuciaError("AUTH_INVALID_USER_ID");
      }

      return user;
   },
   setKey: async (key: KeySchema) => {
      Log.info({ key }, "lucia::setKey");
      try {
         await utls.insertKey(db, key);
      } catch (e) {
         console.log(e);
      }
   },
   getKey: async (keyId: string, shouldDelete): Promise<KeySchema | null> => {
      Log.info({ keyId }, "lucia::getKey");

      return await db.transaction(async (tx) => {
         const [key] = await tx
            .select()
            .from(AUTH_SCHEMA.key)
            .where(eq(AUTH_SCHEMA.key.id, keyId));

         if (!key) {
            return null;
         }

         const covertedKey = utls.convertToKeySchema(key);
         if (await shouldDelete(covertedKey)) {
            await tx
               .delete(AUTH_SCHEMA.key)
               .where(eq(AUTH_SCHEMA.key.id, keyId));
         }

         return covertedKey;
      });
   },
   getKeysByUserId: async (userId): Promise<KeySchema[]> => {
      Log.info({ userId }, "lucia::getKeysByUserId");

      const keys = await db
         .select()
         .from(AUTH_SCHEMA.key)
         .where(eq(AUTH_SCHEMA.key.userId, userId));

      return keys.map(utls.convertToKeySchema);
   },
   updateKeyPassword: async (keyId: string, hashedPassword: string | null) => {
      Log.info(
         {
            keyId,
            hashedPassword: "Hidden by logger",
         },
         "lucia::updateKeyPassword"
      );

      const [updatedKey] = await db
         .update(AUTH_SCHEMA.key)
         .set({
            hashedPassword,
         })
         .where(eq(AUTH_SCHEMA.key.id, keyId))
         .returning({ id: AUTH_SCHEMA.key.id });

      if (!updatedKey) {
         // There was no key entry in the database with keyId
         throw new LuciaError("AUTH_INVALID_KEY_ID");
      }
   },
   deleteKeysByUserId: async (userId: string) => {
      Log.info({ userId }, "lucia::deleteKeysByUserId");
      await db
         .delete(AUTH_SCHEMA.key)
         .where(eq(AUTH_SCHEMA.key.userId, userId));
   },
   deleteNonPrimaryKey: async (keyId: string) => {
      Log.info({ keyId }, "lucia::deleteNonPrimaryKey");
      await db
         .delete(AUTH_SCHEMA.key)
         .where(
            and(
               eq(AUTH_SCHEMA.key.id, keyId),
               eq(AUTH_SCHEMA.key.primaryKey, false)
            )
         );
   },
} as const;

const sessionAdapter: SessionAdapter = {
   // updateSession: async (
   //    sessionId: string,
   //    partialSession: Partial<SessionSchema>
   // ) => {
   //    Log.info("lucia::updateSession", { sessionId, partialSession });

   //    await db
   //       .update(SCHEMA.session)
   //       .set({
   //          id: partialSession.id,
   //          activeExpires: !!partialSession.active_expires
   //             ? Number(partialSession.active_expires)
   //             : undefined,
   //          idleExpires: !!partialSession.idle_expires
   //             ? Number(partialSession.active_expires)
   //             : undefined,
   //          userId: partialSession.user_id,
   //       })
   //       .where(eq(SCHEMA.session.id, sessionId));
   // },
   getSession: async (sessionId: string): Promise<SessionSchema | null> => {
      Log.info({ sessionId }, "lucia::getSession");
      const [session] = await db
         .select()
         .from(AUTH_SCHEMA.session)
         .where(eq(AUTH_SCHEMA.session.id, sessionId));
      if (!session) {
         return null;
      }
      return utls.convertToSessionSchema(session);
   },
   getSessionsByUserId: async (userId: string): Promise<SessionSchema[]> => {
      Log.info({ userId }, "lucia::getSessionsByUserId");
      const sessions = await db
         .select()
         .from(AUTH_SCHEMA.session)
         .where(eq(AUTH_SCHEMA.session.userId, userId));
      return sessions.map(utls.convertToSessionSchema);
   },

   setSession: async (session: SessionSchema) => {
      Log.info({ session }, "lucia::setSession");
      await utls.insertSession(db, session);
   },
   deleteSession: async (sessionId: string) => {
      Log.info({ sessionId }, "lucia::setSession");
      await db
         .delete(AUTH_SCHEMA.session)
         .where(eq(AUTH_SCHEMA.session.id, sessionId));
   },
   deleteSessionsByUserId: async (userId: string) => {
      Log.info({ userId }, "lucia::deleteSessionsByUserId");
      await db
         .delete(AUTH_SCHEMA.session)
         .where(eq(AUTH_SCHEMA.session.userId, userId));
   },
} as const;

export const adapter = (): Adapter =>
   ({
      ...userAdaper,
      ...sessionAdapter,
      getSessionAndUserBySessionId: async (
         sessionId: string
      ): Promise<{
         user: UserSchema;
         session: SessionSchema;
      } | null> => {
         Log.info({ sessionId }, "lucia::getSessionAndUserBySessionId");
         const [session] = await db
            .select()
            .from(AUTH_SCHEMA.session)
            .where(eq(AUTH_SCHEMA.session.id, sessionId));
         if (!session) {
            return null;
         }
         const [user] = await db
            .select()
            .from(AUTH_SCHEMA.user)
            .where(eq(AUTH_SCHEMA.user.id, session.userId));
         if (!user) {
            return null;
         }
         return {
            session: utls.convertToSessionSchema(session),
            user,
         };
      },
   } satisfies Adapter);

namespace utls {
   export const insertUser = async (
      db: Database,
      id: string,
      attrs: Record<any, any>
   ): Promise<UserSchema> => {
      const safeAttrs = AuthZod.USER_TABLE_SCHEMA.insert
         .omit({ id: true })
         .parse(attrs);
      const [data] = await db
         .insert(AUTH_SCHEMA.user)
         .values({ id, ...safeAttrs })
         .returning();

      if (!data) {
         throw new Error("UNABLE_TO_INSERT_USER");
      }
      return Object.freeze(data) satisfies UserSchema;
   };

   export const insertKey = async (db: Database, key: KeySchema) => {
      await db.insert(AUTH_SCHEMA.key).values({
         id: key.id,
         userId: key.user_id,
         hashedPassword: key.hashed_password,
         primaryKey: key.primary_key,
         expires: key.expires,
      });
   };

   export const insertSession = async (
      db: Database,
      session: SessionSchema
   ) => {
      return await db.insert(AUTH_SCHEMA.session).values({
         id: session.id,
         userId: session.user_id,
         activeExpires: Number(session.active_expires),
         idleExpires: Number(session.idle_expires),
      });
   };

   export const convertToKeySchema = (key: Auth.Key): KeySchema => {
      return {
         id: key.id,
         user_id: key.userId,
         hashed_password: key.hashedPassword,
         primary_key: key.primaryKey ?? false,
         expires: key.expires,
      };
   };

   export const convertToSessionSchema = (
      session: Auth.Session
   ): SessionSchema => {
      return {
         id: session.id,
         user_id: session.userId,
         active_expires: session.activeExpires,
         idle_expires: session.idleExpires,
      };
   };

   export const isDatabaseError: (e: any | unknown) => void = (
      error
   ): asserts error is DatabaseError => {
      if (!(error instanceof DatabaseError)) {
         throw error;
      }
   };
}
