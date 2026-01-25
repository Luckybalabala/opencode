import { Hono } from "hono"
import { describeRoute, resolver } from "hono-openapi"
import { streamSSE } from "hono/streaming"
import { Log } from "../../util/log"
import { Bus } from "@/bus"
import { BusEvent } from "@/bus/bus-event"

export const StreamingRoutes = () => {
  const app = new Hono()
  const log = Log.create({ service: "server" })

  app.get(
    "/event",
    describeRoute({
      summary: "Subscribe to events",
      description: "Get events",
      operationId: "event.subscribe",
      responses: {
        200: {
          description: "Event stream",
          content: {
            "text/event-stream": {
              schema: resolver(BusEvent.payloads()),
            },
          },
        },
      },
    }),
    async (c) => {
      log.info("event connected")
      return streamSSE(c, async (stream) => {
        stream.writeSSE({
          data: JSON.stringify({
            type: "server.connected",
            properties: {},
          }),
        })
        const unsub = Bus.subscribeAll(async (event) => {
          await stream.writeSSE({
            data: JSON.stringify(event),
          })
          if (event.type === Bus.InstanceDisposed.type) {
            stream.close()
          }
        })

        // Send heartbeat every 30s to prevent WKWebView timeout (60s default)
        const heartbeat = setInterval(() => {
          stream.writeSSE({
            data: JSON.stringify({
              type: "server.heartbeat",
              properties: {},
            }),
          })
        }, 30000)

        await new Promise<void>((resolve) => {
          stream.onAbort(() => {
            clearInterval(heartbeat)
            unsub()
            resolve()
            log.info("event disconnected")
          })
        })
      })
    },
  )

  return app
}
