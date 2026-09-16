const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function forward(request: Request, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const source = new URL(request.url);
  const headers: Record<string, string> = { "X-Organization-ID": request.headers.get("x-organization-id") || "local-org" };
  const authorization = request.headers.get("authorization");
  const contentType = request.headers.get("content-type");
  if (authorization) headers.authorization = authorization;
  if (contentType) headers["content-type"] = contentType;
  const response = await fetch(`${apiBase}/api/v1/${path.join("/")}${source.search}`, { method: request.method, headers, body: request.method === "GET" ? undefined : await request.arrayBuffer(), cache: "no-store" });
  return new Response(response.body, { status: response.status, headers: { "content-type": response.headers.get("content-type") || "application/json", "content-disposition": response.headers.get("content-disposition") || "" } });
}
export const GET = forward;
export const POST = forward;
export const PATCH = forward;
