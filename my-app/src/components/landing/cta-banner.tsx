"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Typewriter } from "./typewriter";

interface CtaBannerProps {
  isAuthed: boolean;
}

export function CtaBanner({ isAuthed }: CtaBannerProps) {
  return (
    <section
      className="relative isolate overflow-hidden border-t border-border"
      style={{
        // Paint-only radial gradient — no filter:blur compositing cost
        background:
          "radial-gradient(ellipse 900px 500px at 50% 50%, rgba(11,122,42,0.14), transparent 65%), radial-gradient(ellipse 600px 380px at 20% 30%, rgba(244,196,48,0.14), transparent 60%), #F7FAF2",
      }}
    >
      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-fade-overlay"
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-[10px] font-medium text-foreground/70 uppercase tracking-[0.2em]">
            Ready to report
          </span>

          <h2 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground tracking-[-0.03em] leading-[1]">
            <Typewriter text="Keep classroom concerns visible." speed={45} />
          </h2>
          <p className="mt-6 text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            Sign in with your school ID to post a report, track updates, or
            support a concern that other users already raised.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={isAuthed ? "/dashboard" : "/login"}
              className="group flex items-center gap-2 pl-6 pr-2 py-2 text-sm font-medium rounded-full bg-foreground text-background active:scale-[0.97] transition-transform duration-200 shadow-[0_4px_20px_rgba(11,122,42,0.24),inset_0_1px_0_rgba(255,255,255,0.35)]"
            >
              {isAuthed ? "Open dashboard" : "Sign in"}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background/10 group-hover:bg-background/20 group-hover:translate-x-0.5 group-hover:-translate-y-[1px] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <Link
              href="/#features"
              className="px-6 py-3 text-sm font-medium rounded-full border border-border bg-white text-foreground/90 hover:bg-muted active:scale-[0.97] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] inner-highlight"
            >
              View features
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
