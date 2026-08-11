// Thin wrapper around Stockfish 18 (lite, single-threaded WASM build) running in a
// Web Worker, client-side only. No server compute cost. Commands are serialized
// through one worker/one queue so evaluate() calls and getBestMove() calls never race.
//
// Files served from /public/stockfish/ (copied from node_modules/stockfish/bin at
// build time — see PROCESS.md). "lite-single" chosen deliberately: no COOP/COEP
// cross-origin-isolation headers required (unlike the multi-threaded build), while
// still being far stronger than any human opponent.

// Mate scores are a fundamentally different kind of value than centipawns — mixing
// them into one numeric space (the old approach: mate-in-N -> ~100000-N) is what
// produced nonsense like "blunder (-99781cp)" once a mate score entered the diff.
// EngineEval keeps them as a tagged union so callers must handle mate explicitly.
export type EngineEval = { type: "cp"; value: number } | { type: "mate"; value: number };

export type GetBestMoveOptions = {
  skillLevel?: number; // 0-20, Stockfish's own Skill Level UCI option
  movetimeMs?: number;
  depth?: number;
};

export type BestMoveResult = { move: string; eval: EngineEval | null };

export interface ChessEngine {
  getBestMove(fen: string, opts?: GetBestMoveOptions): Promise<BestMoveResult | null>;
  evaluate(fen: string, depth?: number): Promise<EngineEval | null>;
  terminate(): void;
}

function parseScoreLine(line: string): EngineEval | null {
  const m = line.match(/score (cp|mate) (-?\d+)/);
  if (!m) return null;
  return m[1] === "mate" ? { type: "mate", value: Number(m[2]) } : { type: "cp", value: Number(m[2]) };
}

class StockfishEngine implements ChessEngine {
  private worker: Worker | null = null;
  private ready: Promise<void> | null = null;
  private queue: Promise<void> = Promise.resolve();

  private ensureWorker(): Worker {
    if (!this.worker) {
      this.worker = new Worker("/stockfish/stockfish-18-lite-single.js");
    }
    return this.worker;
  }

  private init(): Promise<void> {
    if (this.ready) return this.ready;
    const worker = this.ensureWorker();
    this.ready = new Promise((resolve) => {
      const onMessage = (e: MessageEvent<string>) => {
        if (e.data === "uciok") {
          worker.postMessage("isready");
        } else if (e.data === "readyok") {
          worker.removeEventListener("message", onMessage);
          resolve();
        }
      };
      worker.addEventListener("message", onMessage);
      worker.postMessage("uci");
    });
    return this.ready;
  }

  private run<T>(fn: (worker: Worker) => Promise<T>): Promise<T> {
    const task = this.queue.then(() => this.init()).then(() => fn(this.ensureWorker()));
    this.queue = task.then(
      () => undefined,
      () => undefined
    );
    return task;
  }

  getBestMove(fen: string, opts: GetBestMoveOptions = {}): Promise<BestMoveResult | null> {
    return this.run(
      (worker) =>
        new Promise((resolve) => {
          let lastEval: EngineEval | null = null;
          const onMessage = (e: MessageEvent<string>) => {
            const line = e.data;
            const score = parseScoreLine(line);
            if (score) lastEval = score;
            if (line.startsWith("bestmove")) {
              worker.removeEventListener("message", onMessage);
              const move = line.split(" ")[1];
              resolve(!move || move === "(none)" ? null : { move, eval: lastEval });
            }
          };
          worker.addEventListener("message", onMessage);
          if (opts.skillLevel !== undefined) {
            worker.postMessage(`setoption name Skill Level value ${Math.max(0, Math.min(20, opts.skillLevel))}`);
          }
          worker.postMessage("ucinewgame");
          worker.postMessage(`position fen ${fen}`);
          worker.postMessage(opts.depth ? `go depth ${opts.depth}` : `go movetime ${opts.movetimeMs ?? 700}`);
        })
    );
  }

  // Eval from the perspective of the side to move in `fen`, at the given search depth.
  evaluate(fen: string, depth = 12): Promise<EngineEval | null> {
    return this.run(
      (worker) =>
        new Promise((resolve) => {
          let lastScore: EngineEval | null = null;
          const onMessage = (e: MessageEvent<string>) => {
            const line = e.data;
            const score = parseScoreLine(line);
            if (score) lastScore = score;
            if (line.startsWith("bestmove")) {
              worker.removeEventListener("message", onMessage);
              resolve(lastScore);
            }
          };
          worker.addEventListener("message", onMessage);
          worker.postMessage("ucinewgame");
          worker.postMessage(`position fen ${fen}`);
          worker.postMessage(`go depth ${depth}`);
        })
    );
  }

  terminate() {
    this.worker?.terminate();
    this.worker = null;
    this.ready = null;
  }
}

export function createEngine(): ChessEngine {
  return new StockfishEngine();
}

// Flips an eval to the opponent's perspective.
export function flipEval(e: EngineEval): EngineEval {
  return e.type === "cp" ? { type: "cp", value: -e.value } : { type: "mate", value: -e.value };
}

// Signed centipawns for the White side, given an eval that's relative to the side to
// move. Used for the eval bar (which always shows White's perspective) and charts.
export function evalAsWhiteCp(e: EngineEval, sideToMove: "w" | "b"): number {
  const forSideToMove = e.type === "mate" ? Math.sign(e.value) * (10000 - Math.abs(e.value) * 10) : e.value;
  return sideToMove === "w" ? forSideToMove : -forSideToMove;
}

export function formatEval(e: EngineEval, sideToMove: "w" | "b" = "w"): string {
  if (e.type === "mate") {
    const n = Math.abs(e.value);
    const winner = (e.value > 0) === (sideToMove === "w") ? "White" : "Black";
    return `${winner === "White" ? "M" : "-M"}${n}`;
  }
  const pawns = e.value / 100;
  return pawns > 0 ? `+${pawns.toFixed(1)}` : pawns.toFixed(1);
}
