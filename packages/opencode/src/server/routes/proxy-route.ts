import { Hono } from "hono"
import { proxy } from "hono/proxy"

export const ProxyRoutes = () => {
  const app = new Hono()

  app.all("/*", async (c) => {
    const path = c.req.path

    const response = await proxy(`https://app.opencode.ai${path}`, {
      ...c.req,
      headers: {
        ...c.req.raw.headers,
        host: "app.opencode.ai",
      },
    })
    response.headers.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' data:",
    )
    return response
  }) as unknown as Hono

  return app
}
