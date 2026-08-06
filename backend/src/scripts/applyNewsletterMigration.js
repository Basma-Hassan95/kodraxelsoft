import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(backendRoot, ".env") });
dotenv.config({ path: path.join(backendRoot, ".env.local"), override: true });

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
console.log("url?", Boolean(url), "key?", Boolean(key));
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const sqlPath = path.join(
  backendRoot,
  "supabase/migrations/012_newsletter_subscribers.sql"
);
const sql = fs.readFileSync(sqlPath, "utf8");

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  const pgQuery = `${url.replace(/\/$/, "")}/pg/query`;
  try {
    const res = await fetch(pgQuery, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: sql }),
    });
    const text = await res.text();
    console.log("pg/query status:", res.status);
    console.log(text.slice(0, 500));
    if (res.ok) {
      console.log("Migration applied via pg/query");
      return;
    }
  } catch (err) {
    console.log("pg/query failed:", err.message);
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .select("id")
    .limit(1);
  if (!error) {
    console.log("newsletter_subscribers already exists");
    return;
  }
  console.error(
    "Could not auto-apply SQL. Run backend/supabase/migrations/012_newsletter_subscribers.sql in Supabase SQL Editor."
  );
  console.error("Probe error:", error.message);
  process.exit(2);
}

main();
