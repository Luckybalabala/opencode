import { Hono } from "hono"
import { describeRoute, resolver } from "hono-openapi"
import z from "zod"
import { Instance } from "../../project/instance"

export const InstanceRoutes = () => {
  const app = new Hono()

  app.post(
    "/instance/dispose",
    describeRoute({
      summary: "Dispose instance",
      description: "Clean up and dispose the current OpenCode instance, releasing all resources.",
      operationId: "instance.dispose",
      responses: {
        200: {
          description: "Instance disposed",
          content: {
            "application/json": {
              schema: resolver(z.union([z.literal(true), z.literal(false)])),
            },
          },
        },
      },
    }),
    async (c) => {
      await Instance.dispose()
      return c.json(true)
    },
  )

  return app
}
