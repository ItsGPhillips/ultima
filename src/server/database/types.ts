import { InferModel } from "drizzle-orm";
import { key, session, user } from "./schema/auth";
import { post, page, subscription } from "./schema";

export type Post<T extends "insert" | "select" = "select"> = InferModel<
   typeof post,
   T
>;

export type Page<T extends "insert" | "select" = "select"> = InferModel<
   typeof page,
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
