import alchemy from "alchemy"
import { Worker } from "alchemy/cloudflare"

// Initialize the Alchemy application scope
const app = await alchemy("my-first-app", {
  stage: "dev",
  phase: process.argv.includes("--destroy") ? "destroy" : "up",
})

// Create a simple worker
const worker = await Worker("hello-worker", {
  entrypoint: "./src/worker.ts",
  url: true, // Enable workers.dev subdomain
})

console.log(`Worker deployed at: ${worker.url}`)

// Finalize the app to apply changes
await app.finalize()
