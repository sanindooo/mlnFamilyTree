import { boolean, index, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  slug: text("slug").notNull().unique(),
  fullName: text("full_name").notNull(),
  familyConnection: text("family_connection").notNull(),
  location: text("location").notNull(),
  aboutMe: text("about_me"),
  interests: text("interests"),
  profession: text("profession"),
  company: text("company"),
  phone: text("phone"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  websiteUrl: text("website_url"),
  profilePhotoUrl: text("profile_photo_url"),
  isVisibleInDirectory: boolean("is_visible_in_directory")
    .notNull()
    .default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => ({
  visibleDirectoryIdx: index("idx_user_profiles_visible_directory")
    .on(table.isVisibleInDirectory, table.fullName),
}));

export const waitlistEntries = pgTable("waitlist_entries", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  familyConnection: text("family_connection").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => ({
  statusIdx: index("idx_waitlist_entries_status").on(table.status),
}));

export type InsertUserProfile = typeof userProfiles.$inferInsert;
export type SelectUserProfile = typeof userProfiles.$inferSelect;
export type InsertWaitlistEntry = typeof waitlistEntries.$inferInsert;
export type SelectWaitlistEntry = typeof waitlistEntries.$inferSelect;
