import { eq, and } from 'drizzle-orm';
import {
  Adapter,
  UserSchema,
  LuciaError,
  SessionSchema,
  KeySchema,
  UserAdapter,
  SessionAdapter,
} from 'lucia-auth';
import { DatabaseError } from 'pg';

import { Log } from '@website/utils';
import { schema, db, zod } from '@website/database';
import type { Auth, Database } from '@website/database';

const userAdaper: UserAdapter = {
  getUser: async (id: string): Promise<UserSchema | null> => {
    Log.info({ id }, 'lucia::getUser');

    const [user] = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.id, id))
      .limit(1);
    return user ?? null;
  },
  setUser: async (
    id: string,
    attrs: Record<any, any>,
    key: Readonly<KeySchema> | null
  ): Promise<UserSchema | void> => {
    Log.info({ id, key }, 'lucia::setUser');

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
      if ('code' in e) {
        switch (e.code) {
          case '23505': {
            throw new LuciaError('AUTH_DUPLICATE_KEY_ID');
          }
        }
      }
      throw e;
    }
  },
  deleteUser: async (userId: string) => {
    Log.info({ userId }, 'lucia::deleteUser');
    await db.delete(schema.user).where(eq(schema.user.id, userId));
  },
  updateUserAttributes: async (
    userId: string,
    unknown_attrs: Record<string, unknown>
  ): Promise<UserSchema> => {
    Log.info({ userId, attr: unknown_attrs }, 'lucia::updateUserAttributes');

    const attrs = zod.Auth.USER_TABLE_SCHEMA.insert
      .omit({ id: true })
      .parse(unknown_attrs);

    const [user] = await db
      .update(schema.user)
      .set(attrs)
      .where(eq(schema.user.id, userId))
      .returning();

    if (!user) {
      throw new LuciaError('AUTH_INVALID_USER_ID');
    }

    return user;
  },
  setKey: async (key: KeySchema) => {
    Log.info({ key }, 'lucia::setKey');
    try {
      await utls.insertKey(db, key);
    } catch (e) {
      console.log(e);
    }
  },
  getKey: async (keyId: string, shouldDelete): Promise<KeySchema | null> => {
    Log.info({ keyId }, 'lucia::getKey');

    return await db.transaction(async (tx) => {
      const [key] = await tx
        .select()
        .from(schema.key)
        .where(eq(schema.key.id, keyId));

      if (!key) {
        return null;
      }

      const covertedKey = utls.convertToKeySchema(key);
      if (await shouldDelete(covertedKey)) {
        await tx.delete(schema.key).where(eq(schema.key.id, keyId));
      }

      return covertedKey;
    });
  },
  getKeysByUserId: async (userId): Promise<KeySchema[]> => {
    Log.info({ userId }, 'lucia::getKeysByUserId');

    const keys = await db
      .select()
      .from(schema.key)
      .where(eq(schema.key.userId, userId));

    return keys.map(utls.convertToKeySchema);
  },
  updateKeyPassword: async (keyId: string, hashedPassword: string | null) => {
    Log.info(
      {
        keyId,
        hashedPassword: 'Hidden by logger',
      },
      'lucia::updateKeyPassword'
    );

    const [updatedKey] = await db
      .update(schema.key)
      .set({
        hashedPassword,
      })
      .where(eq(schema.key.id, keyId))
      .returning({ id: schema.key.id });

    if (!updatedKey) {
      // There was no key entry in the database with keyId
      throw new LuciaError('AUTH_INVALID_KEY_ID');
    }
  },
  deleteKeysByUserId: async (userId: string) => {
    Log.info({ userId }, 'lucia::deleteKeysByUserId');
    await db.delete(schema.key).where(eq(schema.key.userId, userId));
  },
  deleteNonPrimaryKey: async (keyId: string) => {
    Log.info({ keyId }, 'lucia::deleteNonPrimaryKey');
    await db
      .delete(schema.key)
      .where(and(eq(schema.key.id, keyId), eq(schema.key.primaryKey, false)));
  },
} as const;

const sessionAdapter: SessionAdapter = {
  getSession: async (sessionId: string): Promise<SessionSchema | null> => {
    Log.info({ sessionId }, 'lucia::getSession');
    const [session] = await db
      .select()
      .from(schema.session)
      .where(eq(schema.session.id, sessionId));
    if (!session) {
      return null;
    }
    return utls.convertToSessionSchema(session);
  },
  getSessionsByUserId: async (userId: string): Promise<SessionSchema[]> => {
    Log.info({ userId }, 'lucia::getSessionsByUserId');
    const sessions = await db
      .select()
      .from(schema.session)
      .where(eq(schema.session.userId, userId));
    return sessions.map(utls.convertToSessionSchema);
  },

  setSession: async (session: SessionSchema) => {
    Log.info({ session }, 'lucia::setSession');
    await utls.insertSession(db, session);
  },
  deleteSession: async (sessionId: string) => {
    Log.info({ sessionId }, 'lucia::setSession');
    await db.delete(schema.session).where(eq(schema.session.id, sessionId));
  },
  deleteSessionsByUserId: async (userId: string) => {
    Log.info({ userId }, 'lucia::deleteSessionsByUserId');
    await db.delete(schema.session).where(eq(schema.session.userId, userId));
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
      Log.info({ sessionId }, 'lucia::getSessionAndUserBySessionId');
      const [session] = await db
        .select()
        .from(schema.session)
        .where(eq(schema.session.id, sessionId));
      if (!session) {
        return null;
      }
      const [user] = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, session.userId));
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
    const safeAttrs = zod.Auth.USER_TABLE_SCHEMA.insert
      .omit({ id: true })
      .parse(attrs);
    const [data] = await db
      .insert(schema.user)
      .values({ id, ...safeAttrs })
      .returning();

    if (!data) {
      throw new Error('UNABLE_TO_INSERT_USER');
    }
    return Object.freeze(data) satisfies UserSchema;
  };

  export const insertKey = async (db: Database, key: KeySchema) => {
    await db.insert(schema.key).values({
      id: key.id,
      userId: key.user_id,
      hashedPassword: key.hashed_password,
      primaryKey: key.primary_key,
      expires: key.expires,
    });
  };

  export const insertSession = async (db: Database, session: SessionSchema) => {
    return await db.insert(schema.session).values({
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
