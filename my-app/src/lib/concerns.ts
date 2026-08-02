import type { Enums, Tables, TablesInsert } from "@/types/supabase";

export type ConcernCategory = Enums<"concern_category">;
export type ConcernStatus = Enums<"concern_status">;
export type ConcernReport = Tables<"concern_reports">;
export type ConcernVote = Tables<"concern_votes">;

export type ConcernReportInput = Pick<
  TablesInsert<"concern_reports">,
  "title" | "description" | "category" | "location"
>;

export type CommunityConcern = ConcernReport & {
  authorName: string;
  userVote: number | null;
};

export const CONCERN_CATEGORIES: Array<{ value: ConcernCategory; label: string }> = [
  { value: "equipment", label: "Equipment" },
  { value: "electrical", label: "Electrical" },
  { value: "cleanliness", label: "Cleanliness" },
  { value: "facility", label: "Facility" },
  { value: "safety", label: "Safety" },
  { value: "other", label: "Other" },
];

export const CONCERN_STATUS_LABELS: Record<ConcernStatus, string> = {
  submitted: "Submitted",
  in_review: "In review",
  in_progress: "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
};
