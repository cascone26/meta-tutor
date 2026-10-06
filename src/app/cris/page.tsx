export default function CrisHome() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 1.5rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Cris&apos; Section</h1>
      <p style={{ opacity: 0.8, marginBottom: "1.5rem" }}>
        Home base for Cristian&apos;s own content — classes, RCA, college, and whatever else
        goes here. Each sub-page is its own route under <code>/cris</code>, separate from
        Jacob&apos;s <code>/rca</code> (his own teaching content).
      </p>
      <ul style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <li><a href="/cris/classes">Classes →</a></li>
        <li><a href="/cris/rca">RCA →</a></li>
      </ul>
    </main>
  );
}
