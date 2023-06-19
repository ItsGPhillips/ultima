import { InferModel } from "drizzle-orm";
import { post, subscription } from "./schema/user";
import { key, session, user } from "./schema/auth";
import { group } from "./schema/page";

export type Post<T extends "insert" | "select" = "select"> = InferModel<
   typeof post,
   T
>;

export type Group<T extends "insert" | "select" = "select"> = InferModel<
   typeof group,
   T
>;

export type Subscription<T extends "insert" | "select" = "select"> = InferModel<
   typeof subscription,
   T
>;

export namespace Auth {
   export type Key<T extends "insert" | "select" = "select"> = InferModel<
      typeof key,
      T
   >;
   export type Session<T extends "insert" | "select" = "select"> = InferModel<
      typeof session,
      T
   >;
   export type User<T extends "insert" | "select" = "select"> = InferModel<
      typeof user,
      T
   >;
}
