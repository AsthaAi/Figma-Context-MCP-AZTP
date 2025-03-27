import { config } from "dotenv";

// Load environment variables from .env file
config();

interface ServerConfig {
  figmaApiKey: string;
  port: number;
}

function maskApiKey(key: string): string {
  if (key.length <= 4) return "****";
  return `****${key.slice(-4)}`;
}

interface CliArgs {
  "figma-api-key"?: string;
  port?: number;
}

export function getServerConfig(isStdioMode: boolean): ServerConfig {
  const figmaApiKey = process.env.FIGMA_API_KEY;
  if (!figmaApiKey) {
    throw new Error("FIGMA_API_KEY is not set");
  }

  const port = isStdioMode ? 0 : Number(process.env.PORT) || 3000;

  return {
    figmaApiKey,
    port,
  };
}
