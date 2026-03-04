import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "waitlist.json");

async function readWaitlist(): Promise<string[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeWaitlist(emails: string[]): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(emails, null, 2));
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const emails = await readWaitlist();

    if (emails.includes(email.toLowerCase())) {
      return NextResponse.json({ message: "Already on the list" });
    }

    emails.push(email.toLowerCase());
    await writeWaitlist(emails);

    return NextResponse.json({ message: "Added to waitlist" });
  } catch {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// TODO: For production on Vercel, replace file-based storage with a database
// (Supabase, PlanetScale, Vercel KV, etc.) since serverless functions
// don't have persistent filesystem access.
