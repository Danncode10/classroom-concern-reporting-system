"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import type { ConcernReport, ConcernStatus } from "@/lib/concerns";
import type { Json, Tables } from "@/types/supabase";

type ProfileRow = Tables<"profiles">;

export type AdminConcernReport = ConcernReport & {
  authorName: string;
  authorSchoolId: string | null;
  authorEmail: string | null;
};

export type AdminUser = Pick<
  ProfileRow,
  "id" | "full_name" | "school_id" | "email" | "role" | "is_blocked" | "blocked_at" | "blocked_reason"
>;

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, role, is_blocked")
    .eq("id", user.id)
    .single();

  if (profileError) throw profileError;
  if (profile?.role !== "admin" || profile.is_blocked) {
    throw new Error("Admin access is required.");
  }

  return { supabase, adminId: user.id };
}

function cleanReason(reason?: string) {
  const value = reason?.trim();
  return value ? value.slice(0, 240) : null;
}

export async function listAdminConcernReports(status: ConcernStatus | "all" = "all") {
  const { supabase } = await requireAdmin();

  let query = supabase
    .from("concern_reports")
    .select("*")
    .order("created_at", { ascending: true });

  if (status !== "all") query = query.eq("status", status);

  const { data: reports, error } = await query;
  if (error) throw error;

  const authorIds = Array.from(new Set((reports ?? []).map((report) => report.author_id)));
  const { data: profiles, error: profilesError } = authorIds.length
    ? await supabase
      .from("profiles")
      .select("id, full_name, school_id, email")
      .in("id", authorIds)
    : { data: [] as Array<Pick<ProfileRow, "id" | "full_name" | "school_id" | "email">>, error: null };

  if (profilesError) throw profilesError;

  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  return (reports ?? []).map((report): AdminConcernReport => {
    const author = profileById.get(report.author_id);
    return {
      ...report,
      authorName: author?.full_name || author?.school_id || "NVSU user",
      authorSchoolId: author?.school_id ?? null,
      authorEmail: author?.email ?? null,
    };
  });
}

export async function listAdminUsers() {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, school_id, email, role, is_blocked, blocked_at, blocked_reason")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return data ?? [];
}

export async function updateAdminConcernStatus(reportId: string, status: ConcernStatus, note?: string) {
  const { supabase, adminId } = await requireAdmin();

  const { data: current, error: currentError } = await supabase
    .from("concern_reports")
    .select("id, status")
    .eq("id", reportId)
    .single();

  if (currentError) throw currentError;
  if (current.status === status) return current;

  const { data: updated, error: updateError } = await supabase
    .from("concern_reports")
    .update({ status })
    .eq("id", reportId)
    .select("*")
    .single();

  if (updateError) throw updateError;

  const statusNote = cleanReason(note);
  const metadata: Json = { old_status: current.status, new_status: status };

  const { error: historyError } = await supabase
    .from("concern_status_history")
    .insert({
      report_id: reportId,
      changed_by: adminId,
      old_status: current.status,
      new_status: status,
      note: statusNote,
    });

  if (historyError) throw historyError;

  const { error: moderationError } = await supabase
    .from("moderation_actions")
    .insert({
      admin_id: adminId,
      report_id: reportId,
      action: "change_status",
      reason: statusNote,
      metadata,
    });

  if (moderationError) throw moderationError;

  revalidatePath("/dashboard");
  return updated;
}

export async function setAdminReportRemoved(reportId: string, removed: boolean, reason?: string) {
  const { supabase, adminId } = await requireAdmin();
  const removalReason = removed ? cleanReason(reason) : null;

  const { data, error } = await supabase
    .from("concern_reports")
    .update({
      is_removed: removed,
      removed_at: removed ? new Date().toISOString() : null,
      removed_by: removed ? adminId : null,
      removal_reason: removalReason,
    })
    .eq("id", reportId)
    .select("*")
    .single();

  if (error) throw error;

  const { error: moderationError } = await supabase
    .from("moderation_actions")
    .insert({
      admin_id: adminId,
      report_id: reportId,
      action: removed ? "remove_report" : "restore_report",
      reason: removalReason,
      metadata: { is_removed: removed },
    });

  if (moderationError) throw moderationError;

  revalidatePath("/dashboard");
  return data;
}

export async function setAdminUserBlocked(userId: string, blocked: boolean, reason?: string) {
  const { supabase, adminId } = await requireAdmin();
  if (userId === adminId) throw new Error("You cannot block your own admin account.");

  const blockReason = blocked ? cleanReason(reason) : null;

  const { data, error } = await supabase
    .from("profiles")
    .update({
      is_blocked: blocked,
      blocked_at: blocked ? new Date().toISOString() : null,
      blocked_reason: blockReason,
    })
    .eq("id", userId)
    .select("id, full_name, school_id, email, role, is_blocked, blocked_at, blocked_reason")
    .single();

  if (error) throw error;

  const { error: moderationError } = await supabase
    .from("moderation_actions")
    .insert({
      admin_id: adminId,
      target_user_id: userId,
      action: blocked ? "block_user" : "unblock_user",
      reason: blockReason,
      metadata: { is_blocked: blocked },
    });

  if (moderationError) throw moderationError;

  revalidatePath("/dashboard");
  return data;
}
