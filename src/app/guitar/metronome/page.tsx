import Metronome from "@/components/guitar/Metronome";

export default function MetronomePage() {
  return (
    <div className="pt-6">
      <p className="text-sm text-center mb-2 max-w-sm mx-auto px-5" style={{ color: "var(--g-muted)" }}>
        Tap the tempo button a few times in rhythm, or drag the slider.
      </p>
      <Metronome />
    </div>
  );
}
