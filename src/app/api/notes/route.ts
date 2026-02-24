import { readFileSync } from "fs";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  const notes = readFileSync(
    join(process.cwd(), "src/lib/notes.txt"),
    "utf-8"
  );
  return NextResponse.json({ notes });
}
