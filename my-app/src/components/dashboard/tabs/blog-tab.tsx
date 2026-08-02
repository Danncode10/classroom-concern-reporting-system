"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ClipboardList,
  Loader2,
  MapPin,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  listAdminConcernReports,
  setAdminReportRemoved,
  updateAdminConcernStatus,
  type AdminConcernReport,
} from "@/services/admin";
import { CONCERN_STATUS_LABELS, type ConcernStatus } from "@/lib/concerns";

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

const EMPTY_REPORTS: AdminConcernReport[] = [];

function reasonPrompt(action: string) {
  const reason = window.prompt(`${action} reason`);
  return reason === null ? undefined : reason;
}

function ReportCard({
  report,
  isBusy,
  onStatusChange,
  onToggleRemoved,
}: {
  report: AdminConcernReport;
  isBusy: boolean;
  onStatusChange: (reportId: string, status: ConcernStatus) => void;
  onToggleRemoved: (report: AdminConcernReport) => void;
}) {
  return (
    <article className={`px-5 py-4 ${report.is_removed ? "bg-muted/40" : ""}`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-foreground">{report.title}</h3>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[report.status]}`}>
              {CONCERN_STATUS_LABELS[report.status]}
            </span>
            {report.is_removed && (
              <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-[11px] font-semibold text-destructive">
                Removed
              </span>
            )}
          </div>
          <p className="mt-1 text-[12px] text-muted-foreground">
            {report.authorName}
            {report.authorSchoolId ? ` · ${report.authorSchoolId}` : ""}
          </p>
          <p className="mt-3 text-[13px] text-muted-foreground whitespace-pre-wrap">{report.description}</p>
          {report.image_url && (
            // eslint-disable-next-line @next/next/no-img-element -- User photos use runtime Storage URLs.
            <img src={report.image_url} alt={`Attached photo for ${report.title}`} className="mt-4 max-h-64 w-full rounded-xl border border-border object-cover" />
          )}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="capitalize">{report.category}</span>
            {report.location && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {report.location}
              </span>
            )}
            <span>{new Date(report.created_at).toLocaleString()}</span>
            <span>{report.vote_score} vote score</span>
          </div>
          {report.removal_reason && (
            <p className="mt-3 rounded-lg border border-border bg-background px-3 py-2 text-[12px] text-muted-foreground">
              {report.removal_reason}
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2 xl:w-52">
          <label className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Status
          </label>
          <select
            value={report.status}
            disabled={isBusy}
            onChange={(event) => onStatusChange(report.id, event.target.value as ConcernStatus)}
            className="h-10 rounded-lg border border-input bg-background px-3 text-[13px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {STATUS_FILTERS.filter((status) => status.value !== "all").map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
          <button
            disabled={isBusy}
            onClick={() => onToggleRemoved(report)}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg border px-3 text-[12px] font-semibold transition-colors disabled:opacity-60 ${
              report.is_removed
                ? "border-border bg-background text-foreground hover:bg-muted"
                : "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15"
            }`}
          >
            {report.is_removed ? <RotateCcw className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
            {report.is_removed ? "Restore" : "Remove"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function BlogTab() {
  const [filter, setFilter] = useState<ConcernStatus | "all">("all");
  const qc = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: ["admin-concern-reports", filter],
    queryFn: () => listAdminConcernReports(filter),
  });

  const refreshAdminData = () => {
    qc.invalidateQueries({ queryKey: ["admin-concern-reports"] });
    qc.invalidateQueries({ queryKey: ["community-concerns"] });
    qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    qc.invalidateQueries({ queryKey: ["my-concern-reports"] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ reportId, status }: { reportId: string; status: ConcernStatus }) =>
      updateAdminConcernStatus(reportId, status),
    onSuccess: () => {
      toast.success("Report status updated");
      refreshAdminData();
    },
    onError: (error: Error) => toast.error(error.message || "Status update failed"),
  });

  const removalMutation = useMutation({
    mutationFn: ({ report, reason }: { report: AdminConcernReport; reason?: string }) =>
      setAdminReportRemoved(report.id, !report.is_removed, reason),
    onSuccess: () => {
      toast.success("Report moderation updated");
      refreshAdminData();
    },
    onError: (error: Error) => toast.error(error.message || "Report moderation failed"),
  });

  const reports = reportsQuery.data ?? EMPTY_REPORTS;

  const isBusy = statusMutation.isPending || removalMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">Review Reports</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Review classroom concerns, update statuses, and remove posts when needed.
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

      <div className="grid grid-cols-1 gap-6">
        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-[13px] font-semibold text-foreground">Reports</h3>
            {isBusy && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          {reportsQuery.isLoading ? (
            <div className="p-12 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
          ) : reports.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <ClipboardList className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-[13px] text-muted-foreground">No reports found for this filter.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  isBusy={isBusy}
                  onStatusChange={(reportId, status) => statusMutation.mutate({ reportId, status })}
                  onToggleRemoved={(item) => {
                    const reason = item.is_removed ? undefined : reasonPrompt("Remove report");
                    if (!item.is_removed && reason === undefined) return;
                    removalMutation.mutate({ report: item, reason });
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
