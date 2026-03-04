"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", height: "100%", padding: "2rem", textAlign: "center",
        }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem", color: "var(--foreground)" }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--muted)", marginBottom: "1rem", maxWidth: "400px" }}>
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              background: "var(--accent)", color: "#fff", border: "none",
              padding: "0.625rem 1.25rem", borderRadius: "0.75rem",
              fontSize: "0.875rem", fontWeight: 500, cursor: "pointer",
            }}
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
