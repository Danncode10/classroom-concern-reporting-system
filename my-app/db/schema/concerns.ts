import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { concernCategory, concernStatus, moderationAction } from "./enums";
import { profiles } from "./core";

export const concernReports = pgTable(
  "concern_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    authorId: uuid("author_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    category: concernCategory("category").notNull().default("other"),
    location: text("location"),
    imageUrl: text("image_url"),
    imagePath: text("image_path"),
    status: concernStatus("status").notNull().default("submitted"),
    voteScore: integer("vote_score").notNull().default(0),
    isRemoved: boolean("is_removed").notNull().default(false),
    removedAt: timestamp("removed_at", { withTimezone: true }),
    removedBy: uuid("removed_by").references(() => profiles.id, { onDelete: "set null" }),
    removalReason: text("removal_reason"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`timezone('utc'::text, now())`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`timezone('utc'::text, now())`),
  },
  (table) => ({
    authorIdx: index("concern_reports_author_idx").on(table.authorId),
    statusIdx: index("concern_reports_status_idx").on(table.status),
    categoryIdx: index("concern_reports_category_idx").on(table.category),
    createdAtIdx: index("concern_reports_created_at_idx").on(table.createdAt),
  }),
);

export const concernVotes = pgTable(
  "concern_votes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => concernReports.id, { onDelete: "cascade" }),
    voterId: uuid("voter_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    value: integer("value").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`timezone('utc'::text, now())`),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .default(sql`timezone('utc'::text, now())`),
  },
  (table) => ({
    reportVoterUnique: uniqueIndex("concern_votes_report_voter_idx").on(table.reportId, table.voterId),
    reportIdx: index("concern_votes_report_idx").on(table.reportId),
    voterIdx: index("concern_votes_voter_idx").on(table.voterId),
  }),
);

export const concernStatusHistory = pgTable(
  "concern_status_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    reportId: uuid("report_id")
      .notNull()
      .references(() => concernReports.id, { onDelete: "cascade" }),
    changedBy: uuid("changed_by").references(() => profiles.id, { onDelete: "set null" }),
    oldStatus: concernStatus("old_status"),
    newStatus: concernStatus("new_status").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`timezone('utc'::text, now())`),
  },
  (table) => ({
    reportIdx: index("concern_status_history_report_idx").on(table.reportId),
  }),
);

export const moderationActions = pgTable(
  "moderation_actions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    adminId: uuid("admin_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    targetUserId: uuid("target_user_id").references(() => profiles.id, { onDelete: "set null" }),
    reportId: uuid("report_id").references(() => concernReports.id, { onDelete: "set null" }),
    action: moderationAction("action").notNull(),
    reason: text("reason"),
    metadata: jsonb("metadata").notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`timezone('utc'::text, now())`),
  },
  (table) => ({
    adminIdx: index("moderation_actions_admin_idx").on(table.adminId),
    targetUserIdx: index("moderation_actions_target_user_idx").on(table.targetUserId),
    reportIdx: index("moderation_actions_report_idx").on(table.reportId),
  }),
);
