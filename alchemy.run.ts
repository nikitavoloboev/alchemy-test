import alchemy from "alchemy"

// Initialize the Alchemy application scope
const app = await alchemy("my-first-app", {
  stage: "dev",
  phase: process.argv.includes("--destroy") ? "destroy" : "up",
})
