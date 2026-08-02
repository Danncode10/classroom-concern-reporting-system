"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Search, UserX } from "lucide-react";
import {
  listAdminUsers,
  setAdminUserBlocked,
  type AdminUser,
} from "@/services/admin";

const EMPTY_USERS: AdminUser[] = [];

function reasonPrompt(action: string) {
  const reason = window.prompt(`${action} reason`);
  return reason === null ? undefined : reason;
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
    <div className="flex items-start justify-between gap-3 px-5 py-4">
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

export function ManageUsersTab() {
  const [search, setSearch] = useState("");
  const qc = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: listAdminUsers,
  });

  const blockMutation = useMutation({
    mutationFn: ({ user, reason }: { user: AdminUser; reason?: string }) =>
      setAdminUserBlocked(user.id, !user.is_blocked, reason),
    onSuccess: () => {
      toast.success("User access updated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["community-concerns"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: Error) => toast.error(error.message || "User access update failed"),
  });

  const users = usersQuery.data ?? EMPTY_USERS;
  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return users;

    return users.filter((user) => {
      const values = [
        user.full_name,
        user.school_id,
        user.email,
      ];
      return values.some((value) => value?.toLowerCase().includes(term));
    });
  }, [search, users]);
  const isBusy = blockMutation.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Manage Users</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Block or unblock users who should not post or vote on concerns.
        </p>
      </div>

      <section className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-[13px] font-semibold text-foreground">Users</h3>
          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.5} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or school ID"
                className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-[13px] text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {(usersQuery.isFetching || isBusy) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
        </div>
        {usersQuery.isLoading ? (
          <div className="p-12 text-center"><Loader2 className="w-5 h-5 animate-spin inline" /></div>
        ) : filteredUsers.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <UserX className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <p className="mt-4 text-[13px] text-muted-foreground">
              {search.trim() ? "No users match your search." : "No users found."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredUsers.map((user) => (
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
  );
}
