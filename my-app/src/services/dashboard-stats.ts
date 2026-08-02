"use server";

import { createClient } from "@/utils/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString();

  const [
    openReportsRes,
    todayReportsRes,
    totalReportsRes,
    inProgressReportsRes,
    submittedReportsRes,
    resolvedReportsRes,
  ] = await Promise.all([
    supabase.from("concern_reports").select("*", { count: "exact", head: true }).in("status", ["submitted", "in_review", "in_progress"]),
    supabase.from("concern_reports").select("*", { count: "exact", head: true }).gte("created_at", todayIso),
    supabase.from("concern_reports").select("*", { count: "exact", head: true }).eq("is_removed", false),
    supabase.from("concern_reports").select("*", { count: "exact", head: true }).eq("status", "in_progress"),
    supabase.from("concern_reports").select("*", { count: "exact", head: true }).eq("status", "submitted"),
    supabase.from("concern_reports").select("*", { count: "exact", head: true }).eq("status", "resolved"),
  ]);

  return {
    publishedServices: openReportsRes.count ?? 0,
    todayLeads: todayReportsRes.count ?? 0,
    totalBookings: totalReportsRes.count ?? 0,
    pendingBookings: inProgressReportsRes.count ?? 0,
    newLeads: submittedReportsRes.count ?? 0,
    galleryPublished: resolvedReportsRes.count ?? 0,
  };
}

export async function getRecentActivity(limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("concern_reports")
    .select("id, title, status, author_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []).map((report) => ({
    id: report.id,
    action: `Submitted report: ${report.title}`,
    resource_type: "concern_report",
    resource_id: report.id,
    actor_email: null,
    diff: { status: report.status },
    created_at: report.created_at,
  }));
}
