// Generic lesson-content schema shared by every RCA subject module, so one
// LessonViewer component + one grounding path in /api/rca-chat works for all of
// them instead of hand-special-casing each subject.

export type LessonSection = { label: string; text: string };

export type Lesson = {
  n: number;
  sections: LessonSection[];
  note?: string;
};

export type SubjectContent = {
  overview: string;
  lessons: Lesson[];
  /** How many RCA teaching weeks these lessons are paced across, if not 1 lesson/week
   * (e.g. Saxon 7/6 is 120 lessons over ~33 weeks). Defaults to lessons.length. */
  totalWeeks?: number;
};
