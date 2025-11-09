import type { NextApiRequest, NextApiResponse } from "next";
import { supabase, USE_DUMMY } from "@/lib/supabaseClient";

type Data =
  | { success: true; message?: string; record?: any }
  | { success: false; error: string };

// POST /api/demo
// Expects JSON body with: firstName, lastName, email, jobTitle, company, companySize, country, phone, interest, details, marketingConsent
// Inserts a row into `demo_requests` table in Supabase. If Supabase isn't configured (USE_DUMMY), returns success but doesn't persist.

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    // Basic validation
    const required = ["firstName", "lastName", "email", "company", "companySize", "country", "interest"];
    const missing = required.filter((k) => !body[k] || String(body[k]).trim() === "");
    if (missing.length > 0) {
      return res.status(400).json({ success: false, error: `Missing fields: ${missing.join(", ")}` });
    }

    const record = {
      first_name: String(body.firstName).trim(),
      last_name: String(body.lastName).trim(),
      email: String(body.email).trim(),
      job_title: body.jobTitle ? String(body.jobTitle).trim() : null,
      company: String(body.company).trim(),
      company_size: String(body.companySize).trim(),
      country: String(body.country).trim(),
      phone: body.phone ? String(body.phone).trim() : null,
      interest: String(body.interest).trim(),
      details: body.details ? String(body.details).trim() : null,
      marketing_consent: Boolean(body.marketingConsent),
      created_at: new Date().toISOString(),
    };

    if (USE_DUMMY) {
      // Supabase not configured; return success but don't persist
      return res.status(200).json({ success: true, message: "Demo mode - request accepted (not persisted)", record });
    }

    const { data, error } = await supabase.from("demo_requests").insert([record]).select().single();

    if (error) {
      // If table missing or other DB error, return 500 with message
      return res.status(500).json({ success: false, error: error.message || String(error) });
    }

    return res.status(200).json({ success: true, message: "Request saved", record: data });
  } catch (err: any) {
    console.error("/api/demo error:", err);
    return res.status(500).json({ success: false, error: err.message || "Unknown error" });
  }
}
