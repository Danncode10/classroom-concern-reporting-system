import businessConfig from "../../business.json";

export type DashboardTabId =
  | "home"
  | "create-report"
  | "track-report"
  | "admin"
  | "manage-users"
  | "analytics"
  | "settings";

export type FeatureFlag =
  | "always"
  | "pricing"
  | "contactForm"
  | "gallery"
  | "analytics"
  | "testimonials"
  | "teamPage"
  | "blog";

interface TabConfig {
  id: DashboardTabId;
  label: string;
  feature: FeatureFlag;
}

export const TAB_CONFIG: TabConfig[] = [
  { id: "home",          label: "Home",          feature: "always" },
  { id: "create-report", label: "Create Report", feature: "pricing" },
  { id: "track-report",  label: "Track Report",  feature: "contactForm" },
  { id: "admin",         label: "Review Reports", feature: "blog" },
  { id: "manage-users",  label: "Manage Users",  feature: "blog" },
  { id: "analytics",  label: "Analytics",  feature: "always" },
  { id: "settings",   label: "Settings",   feature: "always" },
];

type FeatureMap = Record<FeatureFlag, boolean>;

const features: FeatureMap = {
  always: true,
  ...((businessConfig as { features?: Partial<FeatureMap> }).features ?? {}),
} as FeatureMap;

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  if (flag === "always") return true;
  return Boolean(features[flag]);
}

export function getEnabledTabs(): TabConfig[] {
  return TAB_CONFIG.filter((t) => isFeatureEnabled(t.feature));
}
