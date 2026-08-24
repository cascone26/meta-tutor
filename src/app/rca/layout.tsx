import RcaAssistant from "@/components/rca/RcaAssistant";
import RcaNotes from "@/components/rca/RcaNotes";
import CalendarPopup from "@/components/rca/CalendarPopup";
import RcaChrome from "@/components/rca/RcaChrome";

export default function RcaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RcaChrome>{children}</RcaChrome>
      {/* Rendered OUTSIDE the dim-mode shell on purpose — that div applies a CSS
          filter when dim mode is on, and `filter` creates a new containing block
          for `position: fixed` descendants, which would break these floating
          panels' fixed-to-viewport positioning. DimModeToggle itself is inside
          RcaChrome but NOT inside the filtered div (see RcaThemeShell), so it's
          unaffected. */}
      <RcaAssistant />
      <RcaNotes />
      <CalendarPopup />
    </>
  );
}
