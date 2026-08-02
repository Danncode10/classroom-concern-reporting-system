"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowDown, ArrowUp, Loader2, MapPin, MessageSquareText } from "lucide-react";
import {
  listCommunityConcerns,
  setConcernVote,
  type CommunityConcern,
  type ConcernStatus,
} from "@/services/concerns";

const STATUS_FILTERS: Array<{ value: ConcernStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "in_review", label: "In review" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

const STATUS_STYLES: Record<ConcernStatus, string> = {
  submitted: "bg-amber-500/10 text-amber-600",
  in_review: "bg-blue-500/10 text-blue-600",
  in_progress: "bg-primary/10 text-primary",
  resolved: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-destructive/10 text-destructive",
};

function formatStatus(status: ConcernStatus) {
  return status.replace(/_/g, " ");
}

function CommunityCard({
  concern,
  onVote,
  isVoting,
}: {
  concern: CommunityConcern;
  onVote: (reportId: string, value: -1 | 1) => void;
  isVoting: boolean;
}) {
  return (
    <article className="px-5 py-4">
      <div className="flex gap-4">
        <div className="flex w-12 shrink-0 flex-col items-center gap-1">
          <button
            onClick={() => onVote(concern.id, 1)}
            disabled={isVoting}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
              concern.userVote === 1
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:text-primary"
            }`}
            title="Upvote"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <p className="text-lg font-semibold text-foreground tabular-nums">{concern.vote_score}</p>
          <button
            onClick={() => onVote(concern.id, -1)}
            disabled={isVoting}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
              concern.userVote === -1
                ? "border-destructive bg-destructive/10 text-destructive"
                : "border-border text-muted-foreground hover:text-destructive"
            }`}
            title="Downvote"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{concern.title}</h3>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[concern.status]}`}>
              {formatStatus(concern.status)}
            </span>
          </div>
          <p className="mt-2 text-[13px] text-muted-foreground whitespace-pre-wrap">{concern.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span>{concern.authorName}</span>
            <span className="capitalize">{concern.category}</span>
            {concern.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {concern.location}
              </span>
            )}
            <span>{new Date(concern.created_at).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export function BookingsTab() {
  const [filter, setFilter] = useState<ConcernStatus | "all">("all");
  const qc = useQueryClient();

  const { data: concerns, isLoading } = useQuery({
    queryKey: ["community-concerns", filter],
    queryFn: () => listCommunityConcerns(filter),
  });

  const voteMutation = useMutation({
    mutationFn: ({ reportId, value }: { reportId: string; value: -1 | 1 }) => setConcernVote(reportId, value),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["community-concerns"] });
      qc.invalidateQueries({ queryKey: ["my-concern-reports"] });
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Vote failed"),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">Community</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Vote on visible classroom concerns so urgent reports are easier to notice.
          </p>
        </div>
        <div className="flex gap-1 bg-muted rounded-lg p-1 flex-wrap">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status.value}
              onClick={() => setFilter(status.value)}
              className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors ${
                filter === status.value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : (concerns ?? []).length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <MessageSquareText className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-[13px] text-muted-foreground">No community reports found for this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {(concerns ?? []).map((concern) => (
              <CommunityCard
                key={concern.id}
                concern={concern}
                isVoting={voteMutation.isPending}
                onVote={(reportId, value) => voteMutation.mutate({ reportId, value })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
