import { Hono } from "hono"
import { describeRoute, resolver, validator } from "hono-openapi"
import z from "zod"
import { Log } from "../../util/log"
import { Global } from "../../global"
import { Instance } from "../../project/instance"
import { Vcs } from "../../project/vcs"
import { Command } from "../../command"
import { LSP } from "../../lsp"
import { Format } from "../../format"
import { errors } from "../error"

export const UtilityRoutes = () => {
  const app = new Hono()

  app.get(
    "/path",
    describeRoute({
      summary: "Get paths",
      description:
        "Retrieve the current working directory and related path information for the OpenCode instance.",
      operationId: "path.get",
      responses: {
        200: {
          description: "Path",
          content: {
            "application/json": {
              schema: resolver(
                z
                  .object({
                    home: z.string(),
                    state: z.string(),
                    config: z.string(),
                    worktree: z.string(),
                    directory: z.string(),
                  })
                  .meta({
                    ref: "Path",
                  }),
              ),
            },
          },
        },
      },
    }),
    async (c) => {
      return c.json({
        home: Global.Path.home,
        state: Global.Path.state,
        config: Global.Path.config,
        worktree: Instance.worktree,
        directory: Instance.directory,
      })
    },
  )

  app.get(
    "/vcs",
    describeRoute({
      summary: "Get VCS info",
      description:
        "Retrieve version control system (VCS) information for the current project, such as git branch.",
      operationId: "vcs.get",
      responses: {
        200: {
          description: "VCS info",
          content: {
            "application/json": {
              schema: resolver(Vcs.Info),
            },
          },
        },
      },
    }),
    async (c) => {
      const branch = await Vcs.branch()
      return c.json({
        branch,
      })
    },
  )

  app.get(
    "/command",
    describeRoute({
      summary: "List commands",
      description: "Get a list of all available commands in the OpenCode system.",
      operationId: "command.list",
      responses: {
        200: {
          description: "List of commands",
          content: {
            "application/json": {
              schema: resolver(Command.Info.array()),
            },
          },
        },
      },
    }),
    async (c) => {
      const commands = await Command.list()
      return c.json(commands)
    },
  )

  app.post(
    "/log",
    describeRoute({
      summary: "Write log",
      description: "Write a log entry to the server logs with specified level and metadata.",
      operationId: "app.log",
      responses: {
        200: {
          description: "Log entry written successfully",
          content: {
            "application/json": {
              schema: resolver(z.union([z.literal(true), z.literal(false)])),
            },
          },
        },
        ...errors(400),
      },
    }),
    validator(
      "json",
      z.object({
        service: z.string().meta({ description: "Service name for the log entry" }),
        level: z.enum(["debug", "info", "error", "warn"]).meta({ description: "Log level" }),
        message: z.string().meta({ description: "Log message" }),
        extra: z
          .record(z.string(), z.any())
          .optional()
          .meta({ description: "Additional metadata for the log entry" }),
      }),
    ),
    async (c) => {
      const { service, level, message, extra } = c.req.valid("json")
      const logger = Log.create({ service })

      switch (level) {
        case "debug":
          logger.debug(message, extra)
          break
        case "info":
          logger.info(message, extra)
          break
        case "error":
          logger.error(message, extra)
          break
        case "warn":
          logger.warn(message, extra)
          break
      }

      return c.json(true)
    },
  )

  app.get(
    "/lsp",
    describeRoute({
      summary: "Get LSP status",
      description: "Get LSP server status",
      operationId: "lsp.status",
      responses: {
        200: {
          description: "LSP server status",
          content: {
            "application/json": {
              schema: resolver(LSP.Status.array()),
            },
          },
        },
      },
    }),
    async (c) => {
      return c.json(await LSP.status())
    },
  )

  app.get(
    "/formatter",
    describeRoute({
      summary: "Get formatter status",
      description: "Get formatter status",
      operationId: "formatter.status",
      responses: {
        200: {
          description: "Formatter status",
          content: {
            "application/json": {
              schema: resolver(Format.Status.array()),
            },
          },
        },
      },
    }),
    async (c) => {
      return c.json(await Format.status())
    },
  )

  return app
}
