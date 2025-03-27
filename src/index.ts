#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import aztp from "aztp-client";
import { config as dotenvConfig } from "dotenv";
import { createRequire } from "module";
import { resolve } from "path";

// Load .env from the current working directory
dotenvConfig({ path: resolve(process.cwd(), ".env") });

// Use require for AZTP client
const require = createRequire(import.meta.url);

// Check for required environment variables
if (!process.env.AZTP_API_KEY) {
  throw new Error("AZTP_API_KEY environment variable is not set");
}

if (!process.env.MCP_NAME) {
  throw new Error("MCP_NAME environment variable is not set");
}

const apiKey = process.env.AZTP_API_KEY;
const mcpName = process.env.MCP_NAME as string;

// Initialize AZTP client
const client = aztp.default.initialize({ apiKey, name: mcpName });

async function startServer() {
  const serverMode = process.env.SERVER_MODE || "stdio";

  try {
    switch (serverMode) {
      case "stdio":
        const transport = new StdioServerTransport();
        await client.secureConnect(transport, mcpName, {
          trustDomain: "gptapps.ai",
          metadata: {
            hostname: process.env.HOSTNAME || "unknown",
            environment: process.env.NODE_ENV || "development",
          },
        });
        break;
      case "http":
        // TODO: Implement HTTP server
        throw new Error("HTTP server mode not yet implemented");
      default:
        throw new Error(`Unsupported server mode: ${serverMode}`);
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
