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
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const phone = "03372027510";
const social_links = {
  github: "https://github.com",
  linkedin: "https://www.linkedin.com/company/kodraxelsoft",
  twitter: "https://twitter.com",
  instagram: "https://www.instagram.com/kodraxelsoft",
  facebook: "https://www.facebook.com/kodraxelsoft",
};

async function main() {
  const { data: current, error: readError } = await supabase
    .from("website_settings")
    .select("id, phone, social_links")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (readError) {
    console.error(readError.message);
    process.exit(1);
  }

  if (!current?.id) {
    const { error } = await supabase.from("website_settings").insert({
      company_name: "Kodraxelsoft Inc.",
      email: "kodraxelsoft@gmail.com",
      phone,
      social_links,
    });
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
    console.log("Inserted website_settings with new phone + social links");
    return;
  }

  const mergedSocial = {
    ...(current.social_links || {}),
    ...social_links,
  };

  const { error } = await supabase
    .from("website_settings")
    .update({
      phone,
      social_links: mergedSocial,
      updated_at: new Date().toISOString(),
    })
    .eq("id", current.id);

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  console.log("Updated website_settings phone + social links");
  console.log("phone:", phone);
  console.log("wa.me:", `https://wa.me/92${phone.slice(1)}`);
}

main();
