"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import {
  createConcernReport,
} from "@/services/concerns";
import { CONCERN_CATEGORIES, type ConcernCategory, type ConcernReportInput } from "@/lib/concerns";

const initialForm: ConcernReportInput = {
  title: "",
  description: "",
  location: "",
  category: "other",
};

export function ServicesTab() {
  const [form, setForm] = useState<ConcernReportInput>(initialForm);
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: createConcernReport,
    onSuccess: () => {
      setForm(initialForm);
      qc.invalidateQueries({ queryKey: ["my-concern-reports"] });
      qc.invalidateQueries({ queryKey: ["community-concerns"] });
      toast.success("Report submitted");
    },
    onError: (error) => toast.error(error instanceof Error ? error.message : "Report failed"),
  });

  const updateForm = (updates: Partial<ConcernReportInput>) => {
    setForm((current) => ({ ...current, ...updates }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">Create Report</h2>
        <p className="mt-1 text-[14px] text-muted-foreground">
          Submit classroom concerns so admins can review and act on them.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          mutation.mutate(form);
        }}
        className="bg-card border border-border rounded-2xl overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_18rem] gap-0">
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <label htmlFor="concern-title" className="text-[12px] font-semibold text-foreground">
                Concern title
              </label>
              <input
                id="concern-title"
                value={form.title}
                onChange={(event) => updateForm({ title: event.target.value })}
                placeholder="Broken ceiling fan in Room 204"
                className="w-full h-11 rounded-xl border border-input bg-background px-3 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="concern-category" className="text-[12px] font-semibold text-foreground">
                  Category
                </label>
                <select
                  id="concern-category"
                  value={form.category}
                  onChange={(event) => updateForm({ category: event.target.value as ConcernCategory })}
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-ring"
                >
                  {CONCERN_CATEGORIES.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="concern-location" className="text-[12px] font-semibold text-foreground">
                  Location
                </label>
                <input
                  id="concern-location"
                  value={form.location ?? ""}
                  onChange={(event) => updateForm({ location: event.target.value })}
                  placeholder="Building, room, or area"
                  className="w-full h-11 rounded-xl border border-input bg-background px-3 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="concern-description" className="text-[12px] font-semibold text-foreground">
                Description
              </label>
              <textarea
                id="concern-description"
                value={form.description}
                onChange={(event) => updateForm({ description: event.target.value })}
                placeholder="Describe what happened, where it is, and why it needs attention."
                rows={7}
                className="w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-[14px] text-foreground outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>
          </div>

          <aside className="border-t lg:border-l lg:border-t-0 border-border bg-muted/30 p-6">
            <div className="space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="h-5 w-5 text-primary" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-[14px] font-semibold text-foreground">Before submitting</h3>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Keep the report clear, specific, and classroom-related.
                </p>
              </div>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Submit Report
              </button>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
