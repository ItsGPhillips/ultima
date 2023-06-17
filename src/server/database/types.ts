import { InferModel } from "drizzle-orm";
import { group, post, subscription } from "./schema/user";

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
