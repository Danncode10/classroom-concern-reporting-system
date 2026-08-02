"use client";

import { useEffect, useRef, useState } from "react";
import { type InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, MapPin, MessageSquareText, ThumbsDown, ThumbsUp } from "lucide-react";
import {
  listCommunityConcerns,
  setConcernVote,
} from "@/services/concerns";
import { CONCERN_STATUS_LABELS, type CommunityConcern, type ConcernStatus } from "@/lib/concerns";

const STATUS_FILTERS: Array<{ value: ConcernStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "in_review", label: "In review" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
];

const COMMUNITY_PAGE_SIZE = 10;
type CommunityPages = InfiniteData<CommunityConcern[], number>;

const STATUS_STYLES: Record<ConcernStatus, string> = {
  submitted: "bg-amber-500/10 text-amber-600",
  in_review: "bg-blue-500/10 text-blue-600",
  in_progress: "bg-primary/10 text-primary",
  resolved: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-destructive/10 text-destructive",
};

function formatStatus(status: ConcernStatus) {
  return CONCERN_STATUS_LABELS[status];
}

function initials(name: string) {
  return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
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
    <article className="rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
      <header className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
          {initials(concern.authorName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[13px] font-semibold text-foreground">{concern.authorName}</p>
            <span className="text-[11px] text-muted-foreground">reported a classroom concern</span>
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{new Date(concern.created_at).toLocaleString()}</p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[concern.status]}`}>
          {formatStatus(concern.status)}
        </span>
      </header>

      <div className="mt-4">
        <h3 className="text-[15px] font-semibold text-foreground">{concern.title}</h3>
        <p className="mt-2 whitespace-pre-wrap text-[13px] leading-6 text-muted-foreground">{concern.description}</p>
        {concern.image_url && (
          // eslint-disable-next-line @next/next/no-img-element -- User photos use runtime Storage URLs.
          <img src={concern.image_url} alt={`Attached photo for ${concern.title}`} className="mt-4 max-h-96 w-full rounded-xl border border-border object-cover" />
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
        <span className="rounded-full bg-muted px-2.5 py-1 capitalize">{concern.category}</span>
        {concern.location && (
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {concern.location}
          </span>
        )}
      </div>

      <footer className="mt-4 flex items-center border-t border-border pt-3">
        <button
          onClick={() => onVote(concern.id, 1)}
          disabled={isVoting}
          className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[12px] font-medium transition-colors ${
            concern.userVote === 1 ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Upvote this concern"
        >
          <ThumbsUp className="h-4 w-4" />
          Upvote
        </button>
        <span className="px-2 text-[12px] font-semibold tabular-nums text-foreground">{concern.vote_score}</span>
        <button
          onClick={() => onVote(concern.id, -1)}
          disabled={isVoting}
          className={`inline-flex h-9 items-center gap-2 rounded-lg px-3 text-[12px] font-medium transition-colors ${
            concern.userVote === -1 ? "bg-destructive/10 text-destructive" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
          title="Downvote this concern"
        >
          <ThumbsDown className="h-4 w-4" />
          Downvote
        </button>
      </footer>
    </article>
  );
}

export function BookingsTab() {
  const [filter, setFilter] = useState<ConcernStatus | "all">("all");
  const qc = useQueryClient();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["community-concerns", filter],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => listCommunityConcerns({ status: filter, offset: pageParam, limit: COMMUNITY_PAGE_SIZE }),
    getNextPageParam: (lastPage, allPages) => lastPage.length === COMMUNITY_PAGE_SIZE
      ? allPages.length * COMMUNITY_PAGE_SIZE
      : undefined,
  });

  const concerns = data?.pages.flat() ?? [];

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fetchNextPage(); },
      { rootMargin: "240px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const voteMutation = useMutation({
    mutationFn: ({ reportId, value }: { reportId: string; value: -1 | 1 }) => setConcernVote(reportId, value),
    onMutate: async ({ reportId, value }) => {
      await qc.cancelQueries({ queryKey: ["community-concerns"] });
      const previous = qc.getQueriesData<CommunityPages>({ queryKey: ["community-concerns"] });

      previous.forEach(([queryKey]) => {
        qc.setQueryData<CommunityPages>(queryKey, (current) => {
          if (!current) return current;
          return {
            ...current,
            pages: current.pages.map((page) => page.map((concern) => {
              if (concern.id !== reportId) return concern;
              const scoreChange = concern.userVote === value ? -value : value - (concern.userVote ?? 0);
              return { ...concern, userVote: concern.userVote === value ? null : value, vote_score: concern.vote_score + scoreChange };
            })),
          };
        });
      });

      return { previous };
    },
    onError: (error, _variables, context) => {
      context?.previous.forEach(([queryKey, cachedData]) => qc.setQueryData(queryKey, cachedData));
      toast.error(error instanceof Error ? error.message : "Vote failed");
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-concern-reports"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
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

      <div className="mx-auto max-w-3xl space-y-3">
        {isLoading ? (
          <div className="p-12 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : concerns.length === 0 ? (
          <div className="rounded-xl border border-border bg-card px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <MessageSquareText className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-[13px] text-muted-foreground">No community reports found for this filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {concerns.map((concern) => (
              <CommunityCard
                key={concern.id}
                concern={concern}
                isVoting={voteMutation.isPending && voteMutation.variables?.reportId === concern.id}
                onVote={(reportId, value) => voteMutation.mutate({ reportId, value })}
              />
            ))}
            <div ref={loadMoreRef} className="flex h-14 items-center justify-center text-[12px] text-muted-foreground">
              {isFetchingNextPage && <Loader2 className="h-4 w-4 animate-spin" />}
              {!hasNextPage && concerns.length > 0 && "You have reached the end of the community feed."}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
