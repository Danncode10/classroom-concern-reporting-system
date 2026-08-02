import { getUserProfile } from "@/services/dashboard";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CtaBanner } from "@/components/landing/cta-banner";
import { Typewriter } from "@/components/landing/typewriter";
import { ClipboardList, Gauge, MessageSquareWarning, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Post classroom concerns",
    description:
      "Students and professors can report broken chairs, damaged fans, missing equipment, electrical issues, or cleanliness concerns.",
  },
  {
    icon: MessageSquareWarning,
    title: "Community visibility",
    description:
      "Users can see common classroom issues and support reports that need more attention through votes.",
  },
  {
    icon: Gauge,
    title: "Track report status",
    description:
      "Every concern shows a clear status so users know if it is pending, received, in progress, or resolved.",
  },
  {
    icon: ShieldCheck,
    title: "Admin action tools",
    description:
      "Admins can review reports, update status, remove invalid posts, and block users who misuse the system.",
  },
];

export default async function Home() {
  const session = await getUserProfile();
  const user = session?.user || null;

  return (
    <>
      <Navbar user={user} />

      <Hero isAuthed={!!user} />

      <section id="features" className="relative bg-background isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-grid-sm opacity-50"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 grid-fade-overlay-v"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-[10px] font-medium text-foreground/70 uppercase tracking-[0.2em]">
              MVP features
            </span>
            <h2 className="mt-6 text-4xl sm:text-5xl font-semibold text-foreground tracking-[-0.02em]">
              <Typewriter text="Everything needed to report and respond" speed={40} />
            </h2>

            <p className="mt-5 text-[15px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
              A focused flow for posting concerns, raising visibility, and helping admins take action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-3xl border border-border bg-card p-7 inner-highlight"
                >
                  <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-primary/15 bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <HowItWorks />

      <CtaBanner isAuthed={!!user} />

      <Footer />
    </>
  );
}
