(function initSupabaseClient() {
  const config = window.OPC_BACKEND_CONFIG || {};
  const supabaseUrl = String(config.supabaseUrl || "").trim();
  const publishableKey = String(config.publishableKey || "").trim();

  window.SUPABASE_URL = supabaseUrl;
  window.SUPABASE_ANON_KEY = publishableKey;

  if (!supabaseUrl || !publishableKey) return;

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Supabase SDK is not loaded.");
    return;
  }

  window.supabase = window.supabase.createClient(supabaseUrl, publishableKey);
})();
