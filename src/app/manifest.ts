import type { MetadataRoute } from "next";

// Makes the app installable (Add to Home Screen / desktop install) so
// /rca/today opens full-screen like a native app instead of a browser tab —
// real value for the "quick glance during the work day" use case. Deliberately
// NOT paired with a service worker: every /rca page is dynamic + auth-gated,
// and caching that content risks serving stale or broken authenticated pages
// offline, which is worse than no offline support at all.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Meta Tutor",
    short_name: "Meta Tutor",
    description: "Study app and RCA teaching-prep hub",
    start_url: "/rca/today",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3f7ea6",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
