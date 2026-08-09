// Thin wrapper around Stockfish 18 (lite, single-threaded WASM build) running in a
// Web Worker, client-side only. No server compute cost. Commands are serialized
// through one worker/one queue so evaluate() calls and getBestMove() calls never race.
//
// Files served from /public/stockfish/ (copied from node_modules/stockfish/bin at
// build time — see PROCESS.md). "lite-single" chosen deliberately: no COOP/COEP
// cross-origin-isolation headers required (unlike the multi-threaded build), while
// still being far stronger than any human opponent.

export type GetBestMoveOptions = {
  skillLevel?: number; // 0-20, Stockfish's own Skill Level UCI option
  movetimeMs?: number;
  depth?: number;
};

export interface ChessEngine {
  getBestMove(fen: string, opts?: GetBestMoveOptions): Promise<string | null>;
  evaluate(fen: string, depth?: number): Promise<number | null>;
  terminate(): void;
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

  getBestMove(fen: string, opts: GetBestMoveOptions = {}): Promise<string | null> {
    return this.run(
      (worker) =>
        new Promise((resolve) => {
          const onMessage = (e: MessageEvent<string>) => {
            const line = e.data;
            if (line.startsWith("bestmove")) {
              worker.removeEventListener("message", onMessage);
              const move = line.split(" ")[1];
              resolve(!move || move === "(none)" ? null : move);
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

  // Centipawn score from the perspective of the side to move in `fen`, at the given
  // search depth. Positive = good for the side to move. Mate scores are mapped to a
  // large magnitude so loss-comparisons still make sense.
  evaluate(fen: string, depth = 12): Promise<number | null> {
    return this.run(
      (worker) =>
        new Promise((resolve) => {
          let lastScore: number | null = null;
          const onMessage = (e: MessageEvent<string>) => {
            const line = e.data;
            const scoreMatch = line.match(/score (cp|mate) (-?\d+)/);
            if (scoreMatch) {
              const kind = scoreMatch[1];
              const val = Number(scoreMatch[2]);
              lastScore = kind === "mate" ? (val > 0 ? 100000 - val : -100000 - val) : val;
            }
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
