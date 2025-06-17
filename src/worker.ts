import { McpAgent } from "agents/mcp"
import { env } from "cloudflare:workers"

function createApiHandler<
  T extends typeof McpAgent<unknown, unknown, Record<string, unknown>>,
>(agent: T, opts?: { binding?: string }) {
  return {
    fetch: (req: Request, env: unknown, ctx: ExecutionContext) => {
      const url = new URL(req.url)
      if (url.pathname === "/sse" || url.pathname === "/sse/message") {
        return agent
          .serveSSE("/sse", { binding: opts?.binding })
          .fetch(req, env, ctx)
      }
      if (url.pathname === "/mcp") {
        return agent
          .serve("/mcp", { binding: opts?.binding })
          .fetch(req, env, ctx)
      }
      return new Response("Not found", { status: 404 })
    },
  }
}

export type Props = never
export type State = never

export class CloudflareDocumentationMCP extends McpAgent<Env, State, Props> {
  server = new CloudflareMCPServer({
    wae: env,
    serverInfo: {
      name: env.MCP_SERVER_NAME,
      version: env.MCP_SERVER_VERSION,
    },
  })

  constructor(
    public ctx: DurableObjectState,
    public env: Env,
  ) {
    super(ctx, env)
  }

  async init() {
    registerDocsTools(this, this.env)
    registerPrompts(this)
  }
}

export default createApiHandler(CloudflareDocumentationMCP)
