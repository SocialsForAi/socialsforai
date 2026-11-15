import type { Tool } from "ai";
import type { SocialsForAI } from "@socialsforai/sdk";

export type SocialsToolName =
  | "list_accounts"
  | "list_platforms"
  | "create_connect_link"
  | "create_post"
  | "create_posts"
  | "get_post"
  | "list_posts"
  | "delete_post"
  | "get_post_metrics"
  | "list_replies"
  | "list_events";

export interface ToolDefinition {
  name: SocialsToolName;
  description: string;
  input: Record<string, unknown>;
  request: { method: string; path: string; query?: string[]; body?: "*" | string[]; defaults?: Record<string, unknown>; idempotency?: boolean };
  readOnly?: boolean;
  destructive?: boolean;
}

export declare const TOOL_DEFINITIONS: ToolDefinition[];

/** Run one tool against the API; errors come back as { error: { code, message, fix } }. */
export declare function runTool(client: SocialsForAI, name: SocialsToolName, args?: Record<string, unknown>): Promise<Record<string, unknown>>;

/** SocialsForAI tools for generateText, streamText or an Agent. delete_post is left out unless you opt in. */
export declare function socialsTools(options?: { client?: SocialsForAI; apiKey?: string; tools?: SocialsToolName[]; includeDestructive?: boolean }): Partial<Record<SocialsToolName, Tool>>;

export default socialsTools;
