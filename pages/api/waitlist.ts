import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

/**
 * POST /api/waitlist
 * Receives { Name, Email, Role } (or lowercase name/email/role) and inserts into Supabase table
 * named exactly "Waitlist Signups" with columns: id, Name, Email, Role.
 *
 * Important: because the table name contains a space and column names are mixed-case,
 * the SQL below uses quoted identifiers. Create the table in Supabase SQL editor with:
 *
 * create table "Waitlist Signups" (
 *   id bigserial primary key,
 *   "Name" text not null,
 *   "Email" text not null,
 *   "Role" text,
 *   created_at timestamptz default now()
 * );
 */

type Data =
  | { success: true; message?: string; record?: any }
  | { success: false; error: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {

    const body = req.body || {};
    // Accept either camelCase or PascalCase keys from different clients
    const name = body.name || body.Name ? String(body.name || body.Name).trim() : "";
    const email = body.email || body.Email ? String(body.email || body.Email).trim() : "";
    const role = body.role || body.Role || body.interest ? String(body.role || body.Role || body.interest).trim() : "";

    if (!name || !email || !role) {
      return res.status(400).json({ success: false, error: "Missing required fields: Name, Email and Role" });
    }

    // Supabase table columns are: Name, Email, Role (as requested)
    const record = {
      Name: name,
      Email: email,
      Role: role,
      created_at: new Date().toISOString(),
    };

    if (USE_DUMMY) {
      return res.status(200).json({ success: true, message: "Demo mode - saved locally (not persisted)", record });
    }

    const { data, error } = await supabase.from("Waitlist Signups").insert([record]).select().single();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ success: false, error: error.message || String(error) });
    }

    return res.status(200).json({ success: true, message: "Saved", record: data });
  } catch (err: any) {
    console.error("/api/waitlist error:", err);
    return res.status(500).json({ success: false, error: err.message || "Unknown error" });
  }
}
