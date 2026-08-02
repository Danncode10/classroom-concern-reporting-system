"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  ClipboardList,
  Loader2,
  MapPin,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserX,
} from "lucide-react";
import {
  listAdminConcernReports,
  listAdminUsers,
  setAdminReportRemoved,
  setAdminUserBlocked,
  updateAdminConcernStatus,
  type AdminConcernReport,
  type AdminUser,
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
const EMPTY_USERS: AdminUser[] = [];

function reasonPrompt(action: string) {
  const reason = window.prompt(`${action} reason`);
  return reason === null ? undefined : reason;
}

function StatCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: number;
  note: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl px-5 py-5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-[0.15em]">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
        </div>
      </div>
      <p className="mt-4 text-3xl font-bold text-foreground tabular-nums">{value}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>
    </div>
  );
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

function UserRow({
  user,
  isBusy,
  onToggleBlocked,
}: {
  user: AdminUser;
  isBusy: boolean;
  onToggleBlocked: (user: AdminUser) => void;
}) {
  const name = user.full_name || user.school_id || user.email || "NVSU user";

  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-[13px] font-semibold text-foreground">{name}</p>
          {user.role === "admin" && (
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Admin</span>
          )}
          {user.is_blocked && (
            <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-semibold text-destructive">Blocked</span>
          )}
        </div>
        <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{user.school_id || user.email}</p>
        {user.blocked_reason && (
          <p className="mt-1 text-[11px] text-muted-foreground">{user.blocked_reason}</p>
        )}
      </div>
      <button
        disabled={isBusy || user.role === "admin"}
        onClick={() => onToggleBlocked(user)}
        className={`inline-flex h-9 shrink-0 items-center justify-center rounded-lg border px-3 text-[11px] font-semibold transition-colors disabled:opacity-50 ${
          user.is_blocked
            ? "border-border bg-background text-foreground hover:bg-muted"
            : "border-destructive/20 bg-destructive/10 text-destructive hover:bg-destructive/15"
        }`}
      >
        {user.is_blocked ? "Unblock" : "Block"}
      </button>
    </div>
  );
}

export function BlogTab() {
  const [filter, setFilter] = useState<ConcernStatus | "all">("all");
  const qc = useQueryClient();

  const reportsQuery = useQuery({
    queryKey: ["admin-concern-reports", filter],
    queryFn: () => listAdminConcernReports(filter),
  });

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: listAdminUsers,
  });

  const refreshAdminData = () => {
    qc.invalidateQueries({ queryKey: ["admin-concern-reports"] });
    qc.invalidateQueries({ queryKey: ["admin-users"] });
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

  const blockMutation = useMutation({
    mutationFn: ({ user, reason }: { user: AdminUser; reason?: string }) =>
      setAdminUserBlocked(user.id, !user.is_blocked, reason),
    onSuccess: () => {
      toast.success("User access updated");
      refreshAdminData();
    },
    onError: (error: Error) => toast.error(error.message || "User access update failed"),
  });

  const reports = reportsQuery.data ?? EMPTY_REPORTS;
  const users = usersQuery.data ?? EMPTY_USERS;
  const stats = useMemo(() => ({
    submitted: reports.filter((report) => report.status === "submitted").length,
    inProgress: reports.filter((report) => report.status === "in_progress").length,
    removed: reports.filter((report) => report.is_removed).length,
    blocked: users.filter((user) => user.is_blocked).length,
  }), [reports, users]);

  const isBusy = statusMutation.isPending || removalMutation.isPending || blockMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground tracking-tight">Admin</h2>
          <p className="mt-1 text-[14px] text-muted-foreground">
            Moderate reports, statuses, and user access.
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Submitted" value={stats.submitted} note="Needs first review" icon={ClipboardList} />
        <StatCard label="In Progress" value={stats.inProgress} note="Being handled" icon={ShieldCheck} />
        <StatCard label="Removed" value={stats.removed} note="Hidden from feed" icon={Trash2} />
        <StatCard label="Blocked" value={stats.blocked} note="Restricted users" icon={UserX} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
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

        <section className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h3 className="text-[13px] font-semibold text-foreground">Users</h3>
            {usersQuery.isFetching && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          {usersQuery.isLoading ? (
            <div className="p-12 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
          ) : users.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UserX className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-[13px] text-muted-foreground">No users found.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {users.map((user) => (
                <UserRow
                  key={user.id}
                  user={user}
                  isBusy={isBusy}
                  onToggleBlocked={(item) => {
                    const reason = item.is_blocked ? undefined : reasonPrompt("Block user");
                    if (!item.is_blocked && reason === undefined) return;
                    blockMutation.mutate({ user: item, reason });
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
