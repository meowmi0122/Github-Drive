export interface Env {
  API: string;          // GitHub Personal Access Token (repo scope)
  GH_REPO: string;      // owner/repo, e.g. meowmi0122/Github-Drive-Storage
  GH_BRANCH?: string;   // default: main
  JWT_SECRET: string;   // long random string
}

export type Ctx = EventContext<Env, any, any>;

export const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });

export const err = (message: string, status = 400) => json({ error: message }, status);
