import { getSupabaseBrowserClient } from "./supabase";

export async function authenticatedHeaders(extra: Record<string, string> = {}) {
  const client = getSupabaseBrowserClient();
  if (!client) return { "X-Organization-ID": "local-org", ...extra };
  const { data } = await client.auth.getSession();
  const session = data.session;
  const organization = session?.user.app_metadata?.organization_id || session?.user.user_metadata?.organization_id || "local-org";
  return { "X-Organization-ID": organization, ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}), ...extra };
}

export async function currentOrganization() {
  const headers = await authenticatedHeaders();
  return headers["X-Organization-ID"];
}
