import alchemy from "alchemy"
import {
  Worker,
  AnalyticsEngineDataset,
  DurableObjectNamespace,
} from "alchemy/cloudflare"

const app = await alchemy("alchemy-test", {
  stage: "dev",
  phase: process.argv.includes("--destroy") ? "destroy" : "up",
})

const worker = await Worker("mcp-docs", {
  entrypoint: "./src/worker.ts",
  url: true,
  bindings: {
    MCP_METRICS: new AnalyticsEngineDataset("mcp-metrics", {
      dataset: "MCP_METRICS",
    }),
    MCP_OBJECT: new DurableObjectNamespace("mcp-object", {
      className: "CloudflareDocumentationMCP",
      sqlite: true,
    }),
  },
})

console.log(`Worker deployed at: ${worker.url}`)

await app.finalize()
