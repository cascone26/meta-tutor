// Move-quality classification, chess.com/lichess-style tiers. Mate scores are handled
// as their own branch rather than being crammed into the centipawn-loss math — that
// collision (mate-in-N mapped into the same numeric space as cp) is what produced the
// old tracker's nonsense output like "blunder (-99781cp)".
import type { EngineEval } from "./chess-engine";

export type MoveClass = "best" | "excellent" | "good" | "inaccuracy" | "mistake" | "blunder" | "missedMate" | "foundMate";

export const CLASS_LABEL: Record<MoveClass, string> = {
  best: "Best",
  excellent: "Excellent",
  good: "Good",
  inaccuracy: "Inaccuracy",
  mistake: "Mistake",
  blunder: "Blunder",
  missedMate: "Missed mate",
  foundMate: "Found mate",
};

export const CLASS_COLOR: Record<MoveClass, string> = {
  best: "#7ac48a",
  excellent: "#7ac48a",
  good: "#8fae9a",
  inaccuracy: "#e0c07a",
  mistake: "#e0a06a",
  blunder: "#e08a8a",
  missedMate: "#e08a8a",
  foundMate: "#7ac48a",
};

// `before` = eval from the mover's perspective, in the position before the move.
// `afterOpp` = eval from the opponent's perspective, in the position after the move
// (i.e. exactly what engine.evaluate(fenAfter) returns — flip it to compare).
export function classifyMove(before: EngineEval, afterOpp: EngineEval): { cls: MoveClass; cpLoss: number | null } {
  const beforeMateForMe = before.type === "mate" && before.value > 0;
  const beforeMateAgainstMe = before.type === "mate" && before.value < 0;
  // afterOpp is the opponent's eval after my move: negative is bad for them (good for
  // me), positive is good for them (bad for me).
  const afterMateForMe = afterOpp.type === "mate" && afterOpp.value < 0;
  const afterMateAgainstMe = afterOpp.type === "mate" && afterOpp.value > 0;

  if (beforeMateForMe && afterMateForMe) return { cls: "best", cpLoss: null }; // kept the winning mate line
  if (beforeMateForMe && !afterMateForMe) return { cls: "missedMate", cpLoss: null }; // let a forced mate slip
  if (!beforeMateForMe && !beforeMateAgainstMe && afterMateAgainstMe) return { cls: "blunder", cpLoss: null }; // handed over a forced mate
  if (afterMateForMe && !beforeMateForMe) return { cls: "foundMate", cpLoss: null }; // just delivered a forced mate
  if (beforeMateAgainstMe) return { cls: "good", cpLoss: null }; // already lost to forced mate, nothing better was available
  if (before.type === "mate" || afterOpp.type === "mate") return { cls: "mistake", cpLoss: null }; // any remaining edge case

  const evalAfterMine = -afterOpp.value;
  const cpLoss = Math.max(0, before.value - evalAfterMine);

  if (cpLoss < 10) return { cls: "best", cpLoss };
  if (cpLoss < 25) return { cls: "excellent", cpLoss };
  if (cpLoss < 50) return { cls: "good", cpLoss };
  if (cpLoss < 100) return { cls: "inaccuracy", cpLoss };
  if (cpLoss < 200) return { cls: "mistake", cpLoss };
  return { cls: "blunder", cpLoss };
}

// Accuracy score (0-100) for a finished game, roughly matching how chess.com/lichess
// derive a single "how well did you play" number from per-move classifications.
export function accuracyFromClasses(classes: MoveClass[]): number {
  if (classes.length === 0) return 100;
  const penalty: Record<MoveClass, number> = {
    best: 0,
    excellent: 1,
    good: 4,
    inaccuracy: 10,
    mistake: 20,
    blunder: 35,
    missedMate: 35,
    foundMate: 0,
  };
  const total = classes.reduce((sum, c) => sum + penalty[c], 0);
  return Math.max(0, Math.round(100 - total / classes.length));
}
