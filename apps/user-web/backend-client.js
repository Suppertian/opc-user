(function initOpcBackend(global) {
  const config = global.OPC_BACKEND_CONFIG || {};
  const supabaseUrl = String(config.supabaseUrl || "").replace(/\/$/, "");
  const publishableKey = String(config.publishableKey || "").trim();

  function isConfigured() {
    return /^https:\/\//i.test(supabaseUrl) && Boolean(publishableKey);
  }

  function createNotConfiguredError() {
    const error = new Error("Backend is not configured for this copy.");
    error.code = "BACKEND_NOT_CONFIGURED";
    return error;
  }

  async function request(input, init) {
    if (!isConfigured()) throw createNotConfiguredError();

    const requestUrl = new URL(typeof input === "string" ? input : input.url, global.location.href);
    const configuredOrigin = new URL(supabaseUrl).origin;
    if (requestUrl.origin !== configuredOrigin) {
      const error = new Error("Request origin does not match the configured backend.");
      error.code = "BACKEND_ORIGIN_MISMATCH";
      throw error;
    }

    return global.fetch(input, init);
  }

  global.OPCBackend = Object.freeze({ isConfigured, request });
})(window);
