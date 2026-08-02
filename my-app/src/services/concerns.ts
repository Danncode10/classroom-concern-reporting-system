"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { CONCERN_LIMITS, type CommunityConcern, type ConcernReportInput, type ConcernStatus, type ConcernVote } from "@/lib/concerns";

async function requireUserId() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return { supabase, userId: user.id };
}

export async function createConcernReport(input: ConcernReportInput) {
  const { supabase, userId } = await requireUserId();

  const title = input.title.trim();
  const description = input.description.trim();
  const location = input.location?.trim() || null;
  const imageUrl = input.image_url?.trim() || null;
  const imagePath = input.image_path?.trim() || null;

  if (title.length < 5) throw new Error("Title must be at least 5 characters.");
  if (description.length < 10) throw new Error("Description must be at least 10 characters.");
  if (title.length > CONCERN_LIMITS.title) throw new Error(`Title must be ${CONCERN_LIMITS.title} characters or fewer.`);
  if (location && location.length > CONCERN_LIMITS.location) throw new Error(`Location must be ${CONCERN_LIMITS.location} characters or fewer.`);
  if (description.length > CONCERN_LIMITS.description) throw new Error(`Description must be ${CONCERN_LIMITS.description} characters or fewer.`);

  const { data, error } = await supabase
    .from("concern_reports")
    .insert({
      author_id: userId,
      title,
      description,
      location,
      category: input.category,
      image_url: imageUrl,
      image_path: imagePath,
    })
    .select("*")
    .single();

  if (error) throw error;
  revalidatePath("/dashboard");
  return data;
}

export async function listMyConcernReports(status: ConcernStatus | "all" = "all") {
  const { supabase, userId } = await requireUserId();

  let query = supabase
    .from("concern_reports")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function listCommunityConcerns({
  status = "all",
  offset = 0,
  limit = 10,
}: {
  status?: ConcernStatus | "all";
  offset?: number;
  limit?: number;
} = {}) {
  const { supabase, userId } = await requireUserId();

  let query = supabase
    .from("concern_reports")
    .select("*")
    .eq("is_removed", false)
    .order("created_at", { ascending: false })
    .range(offset, offset + Math.min(limit, 25) - 1);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  const { data: reports, error: reportsError } = await query;
  if (reportsError) throw reportsError;

  const reportIds = (reports ?? []).map((report) => report.id);
  const authorIds = Array.from(new Set((reports ?? []).map((report) => report.author_id)));

  const [{ data: votes, error: votesError }, { data: allVotes, error: allVotesError }, { data: profiles, error: profilesError }] = await Promise.all([
    reportIds.length
      ? supabase
        .from("concern_votes")
        .select("report_id, value")
        .eq("voter_id", userId)
        .in("report_id", reportIds)
      : Promise.resolve({ data: [] as Pick<ConcernVote, "report_id" | "value">[], error: null }),
    reportIds.length
      ? supabase
        .from("concern_votes")
        .select("report_id, value")
        .in("report_id", reportIds)
      : Promise.resolve({ data: [] as Pick<ConcernVote, "report_id" | "value">[], error: null }),
    authorIds.length
      ? supabase
        .from("profiles")
        .select("id, full_name, school_id")
        .in("id", authorIds)
      : Promise.resolve({ data: [] as Array<{ id: string; full_name: string | null; school_id: string | null }>, error: null }),
  ]);

  if (votesError) throw votesError;
  if (allVotesError) throw allVotesError;
  if (profilesError) throw profilesError;

  const voteByReport = new Map((votes ?? []).map((vote) => [vote.report_id, vote.value]));
  const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
  const voteCountsByReport = new Map<string, { upvoteCount: number; downvoteCount: number }>();

  for (const vote of allVotes ?? []) {
    const counts = voteCountsByReport.get(vote.report_id) ?? { upvoteCount: 0, downvoteCount: 0 };
    if (vote.value === 1) counts.upvoteCount += 1;
    if (vote.value === -1) counts.downvoteCount += 1;
    voteCountsByReport.set(vote.report_id, counts);
  }

  return (reports ?? []).map((report): CommunityConcern => {
    const author = profileById.get(report.author_id);
    return {
      ...report,
      authorName: author?.full_name || author?.school_id || "NVSU user",
      userVote: voteByReport.get(report.id) ?? null,
      upvoteCount: voteCountsByReport.get(report.id)?.upvoteCount ?? 0,
      downvoteCount: voteCountsByReport.get(report.id)?.downvoteCount ?? 0,
    };
  });
}

export async function setConcernVote(reportId: string, value: -1 | 1) {
  const { supabase, userId } = await requireUserId();

  const { data: existing, error: existingError } = await supabase
    .from("concern_votes")
    .select("id, value")
    .eq("report_id", reportId)
    .eq("voter_id", userId)
    .maybeSingle();

  if (existingError) throw existingError;

  if (existing?.value === value) {
    const { error } = await supabase
      .from("concern_votes")
      .delete()
      .eq("id", existing.id)
      .eq("voter_id", userId);
    if (error) throw error;
  } else if (existing) {
    const { error } = await supabase
      .from("concern_votes")
      .update({ value })
      .eq("id", existing.id)
      .eq("voter_id", userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from("concern_votes")
      .insert({ report_id: reportId, voter_id: userId, value });
    if (error) throw error;
  }

  const { data: votes, error: votesError } = await supabase
    .from("concern_votes")
    .select("value")
    .eq("report_id", reportId);
  if (votesError) throw votesError;

  const upvoteCount = (votes ?? []).filter((vote) => vote.value === 1).length;
  const downvoteCount = (votes ?? []).filter((vote) => vote.value === -1).length;

  revalidatePath("/dashboard");
  return { upvoteCount, downvoteCount };
}
