"use client";

import Link from "next/link";
import PageHeader from "@/components/veritas/PageHeader";
import { READING_PATHS } from "@/data/veritas/reading-guide";

export default function VeritasReadingGuide() {
  return (
    <div className="flex h-full flex-col">
      <PageHeader
        title="Where Should I Start?"
        subtitle="Curated reading paths for every level — beginner to advanced"
        icon="📖"
      />

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 px-6 py-4">
          <div className="rounded-lg bg-stone-900/50 border border-stone-800 p-4">
            <p className="text-sm text-stone-400">
              Three carefully sequenced reading journeys through Catholic spirituality and theology.
              Start with Beginner, then graduate to Intermediate, then Advanced. Each book builds on
              the last.
            </p>
            <p className="mt-2 text-xs text-stone-600">
              For the full catalog of 141+ books with difficulty ratings, word counts, and reading
              times, visit the{" "}
              <Link href="/veritas/library" className="text-amber-600 hover:text-amber-500">
                complete library
              </Link>
              .
            </p>
          </div>

          {READING_PATHS.map((path, pathIndex) => (
            <div key={pathIndex}>
              <h2 className="text-lg font-semibold text-stone-100">{path.name}</h2>
              <p className="mt-1 text-sm text-stone-500">{path.description}</p>

              <div className="mt-3 space-y-2">
                {path.books.map((book, bookIndex) => (
                  <div
                    key={bookIndex}
                    className="rounded-lg border border-stone-800/50 bg-stone-900/30 p-3"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600/20 text-xs font-semibold text-amber-400 flex-shrink-0">
                        {bookIndex + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-stone-200">{book.title}</p>
                        <p className="text-xs text-stone-600">{book.author}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {pathIndex < READING_PATHS.length - 1 && (
                <div className="my-6 flex justify-center">
                  <div className="text-amber-600">↓</div>
                </div>
              )}
            </div>
          ))}

          <div className="rounded-lg bg-stone-900/50 border border-amber-600/30 p-4 mt-6">
            <h3 className="font-semibold text-amber-400">After You Finish</h3>
            <p className="mt-2 text-sm text-stone-400">
              Once you've completed the Advanced path, you'll have a solid foundation in Catholic
              spirituality and theology. At that point:
            </p>
            <ul className="mt-2 space-y-1 text-sm text-stone-400">
              <li>• Study the Catechism of the Catholic Church topically</li>
              <li>• Read selections from the Summa Theologiae systematically</li>
              <li>• Dive into specific doctrines (Marian theology, moral theology, liturgy)</li>
              <li>• Read the Church Fathers (Augustine, Athanasius, Chrysostom, etc.)</li>
            </ul>
          </div>

          <div className="text-center">
            <Link
              href="/veritas/library"
              className="inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-stone-950 transition-colors hover:bg-amber-500"
            >
              View Full Catalog →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
