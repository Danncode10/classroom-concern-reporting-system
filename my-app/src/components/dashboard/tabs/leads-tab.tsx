"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, Loader2, MapPin } from "lucide-react";
import { listMyConcernReports } from "@/services/concerns";
import { CONCERN_STATUS_LABELS, type ConcernReport, type ConcernStatus } from "@/lib/concerns";

const STATUS_FILTERS: Array<{ value: ConcernStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "submitted", label: "Submitted" },
  { value: "in_review", label: "In review" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "rejected", label: "Rejected" },
];

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

function ReportCard({ report }: { report: ConcernReport }) {
  return (
    <article className="px-5 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{report.title}</h3>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${STATUS_STYLES[report.status]}`}>
              {formatStatus(report.status)}
            </span>
          </div>
          <p className="mt-2 text-[13px] text-muted-foreground whitespace-pre-wrap">{report.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="capitalize">{report.category}</span>
            {report.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {report.location}
              </span>
            )}
            <span>{new Date(report.created_at).toLocaleString()}</span>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-[11px] text-muted-foreground">Votes</p>
          <p className="text-xl font-semibold text-foreground tabular-nums">{report.vote_score}</p>
        </div>
      </div>
    </article>
  );
}

export function LeadsTab() {
  const [filter, setFilter] = useState<ConcernStatus | "all">("all");

  const { data: reports, isLoading } = useQuery({
    queryKey: ["my-concern-reports", filter],
    queryFn: () => listMyConcernReports(filter),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">Track Report</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Review your submitted concerns and check their current status.
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
        ) : (reports ?? []).length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <ClipboardList className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-[13px] text-muted-foreground">No reports found for this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {(reports ?? []).map((report) => <ReportCard key={report.id} report={report} />)}
          </div>
        )}
      </div>
    </div>
  );
}
