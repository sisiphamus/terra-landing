export async function onRequestPost(context) {
  const { env, request } = context;

  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: "Invalid email" }), {
        status: 400,
        headers,
      });
    }

    if (!env.WAITLIST_EMAILS) {
      return new Response(JSON.stringify({ error: "Storage unavailable" }), {
        status: 500,
        headers,
      });
    }

    const normalized = email.toLowerCase().trim();

    await env.WAITLIST_EMAILS.put(normalized, JSON.stringify({
      email: normalized,
      timestamp: new Date().toISOString(),
    }));

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to process signup" }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
