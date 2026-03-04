"use client";

import { useState, useEffect } from "react";
import { units, getSelectedUnits, setSelectedUnits } from "@/lib/units";

export default function UnitFilter({ onChange }: { onChange: (unitIds: number[]) => void }) {
  const [selected, setSelected] = useState<number[]>(() => getSelectedUnits());

  useEffect(() => {
    onChange(selected);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function toggle(unitId: number) {
    const next = selected.includes(unitId)
      ? selected.filter((id) => id !== unitId)
      : [...selected, unitId];
    setSelected(next);
    setSelectedUnits(next);
    onChange(next);
  }

  function selectAll() {
    setSelected([]);
    setSelectedUnits([]);
    onChange([]);
  }

  const allSelected = selected.length === 0;

  return (
    <div className="flex gap-1.5 flex-wrap items-center">
      <span className="text-xs font-medium mr-1" style={{ color: "var(--muted)" }}>Units:</span>
      <button
        onClick={selectAll}
        className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
        style={{
          background: allSelected ? "var(--accent)" : "var(--surface)",
          color: allSelected ? "#fff" : "var(--muted)",
          border: `1px solid ${allSelected ? "transparent" : "var(--border)"}`,
        }}
      >
        All
      </button>
      {units.map((unit) => {
        const active = selected.includes(unit.id);
        return (
          <button
            key={unit.id}
            onClick={() => toggle(unit.id)}
            title={unit.description}
            className="text-xs px-2.5 py-1 rounded-full font-medium transition-all"
            style={{
              background: active ? "var(--accent)" : "var(--surface)",
              color: active ? "#fff" : "var(--muted)",
              border: `1px solid ${active ? "transparent" : "var(--border)"}`,
            }}
          >
            {unit.id}. {unit.name}
          </button>
        );
      })}
    </div>
  );
}
