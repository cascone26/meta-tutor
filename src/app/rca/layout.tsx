import RcaAssistant from "@/components/rca/RcaAssistant";
import RcaNotes from "@/components/rca/RcaNotes";
import CalendarPopup from "@/components/rca/CalendarPopup";
import RcaThemeShell from "@/components/rca/RcaThemeShell";

export default function RcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RcaThemeShell>{children}</RcaThemeShell>
      {/* Rendered OUTSIDE the dim-mode shell on purpose — that div applies a CSS
          filter when dim mode is on, and `filter` creates a new containing block
          for `position: fixed` descendants, which would break these floating
          panels' fixed-to-viewport positioning. */}
      <RcaAssistant />
      <RcaNotes />
      <CalendarPopup />
    </>
  );
}
