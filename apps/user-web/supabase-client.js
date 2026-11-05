(function initSupabaseClient() {
  // Configure these values only for a separate demo Supabase project.
  const SUPABASE_URL = "https://YOUR_PROJECT.supabase.co";
  const SUPABASE_ANON_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Supabase SDK is not loaded.");
    return;
  }

  const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabase = supabaseClient;
  window.SUPABASE_URL = SUPABASE_URL;
  window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

  window.testSupabaseConnection = async function testSupabaseConnection() {
    if (!window.supabase || typeof window.supabase.from !== "function") {
      console.error("Supabase client is not initialized.");
      return null;
    }

    const { data, error } = await window.supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Supabase categories query failed", error);
      return null;
    }

    console.log(`Supabase categories result (${data.length} rows)`, data);
    return data;
  };
})();