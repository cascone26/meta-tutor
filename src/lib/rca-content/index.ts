// Registry of every RCA subject that has real transcribed lesson content. A class id
// present here gets the real LessonViewer; absent means link-out-to-doc only (see
// rca/[slug]/page.tsx). Keeps the page/route code generic — no per-subject special-casing.

import type { SubjectContent } from "./types";
import { music34Content } from "./music-3-4";
import { saxon76Content } from "./saxon-76";
import { loeEssentialsCContent } from "./loe-essentials-c";
import { religion6Content } from "./religion-6";
import { classicalLanguageArts6Content } from "./classical-language-arts-6";
import { firstFormLatin6Content } from "./first-form-latin-6";
import { history6Content } from "./history-6";
import { science6Content } from "./science-6";

export const rcaContent: Record<string, SubjectContent> = {
  "music-34": music34Content,
  "saxon-76": saxon76Content,
  "loe-essentials-c": loeEssentialsCContent,
  "religion-6": religion6Content,
  "classical-language-arts-6": classicalLanguageArts6Content,
  "first-form-latin-6": firstFormLatin6Content,
  "history-6": history6Content,
  "science-6": science6Content,
};
