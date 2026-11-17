// queue: "direct" — same fix LessonDraft's Worker needed (see LessonDraft/open-next.config.ts):
// the default MemoryQueue makes a real self-referencing HTTP fetch via an unconfigured
// WORKER_SELF_REFERENCE binding to kick off ISR revalidation, which piles up under concurrent
// load and can exceed the Worker's CPU time limit. "direct" revalidates inline instead.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({ queue: "direct" });
