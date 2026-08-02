import { pgEnum } from "drizzle-orm/pg-core";

export const userRole = pgEnum("user_role", ["admin", "user"]);
export const concernStatus = pgEnum("concern_status", [
  "submitted",
  "in_review",
  "in_progress",
  "resolved",
  "rejected",
]);
export const concernCategory = pgEnum("concern_category", [
  "equipment",
  "electrical",
  "cleanliness",
  "facility",
  "safety",
  "other",
]);
export const moderationAction = pgEnum("moderation_action", [
  "block_user",
  "unblock_user",
  "remove_report",
  "restore_report",
  "change_status",
]);
