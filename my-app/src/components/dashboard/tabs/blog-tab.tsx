"use client";

import { ShieldCheck, ClipboardList, UserX, Trash2 } from "lucide-react";

const ADMIN_AREAS = [
  {
    title: "Report Status",
    note: "Review submitted concerns",
    icon: ClipboardList,
  },
  {
    title: "Removed Posts",
    note: "Handle inappropriate reports",
    icon: Trash2,
  },
  {
    title: "Blocked Users",
    note: "Manage restricted accounts",
    icon: UserX,
  },
];

export function BlogTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Admin</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Moderate reports, statuses, and user access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ADMIN_AREAS.map(({ title, note, icon: Icon }) => (
          <div key={title} className="bg-card border border-border rounded-2xl px-5 py-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 text-[14px] font-semibold text-foreground">{title}</h3>
            <p className="mt-1 text-[12px] text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-2xl px-6 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <ShieldCheck className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <p className="mt-4 text-[13px] text-muted-foreground">
          Admin controls will appear after the report flow is wired.
        </p>
      </div>
    </div>
  );
}
