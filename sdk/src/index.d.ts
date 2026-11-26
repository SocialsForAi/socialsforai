/** Types for @socialsforai/sdk. Field names match the REST API (https://socialsforai.com/openapi.json). */

export declare const DEFAULT_BASE_URL: string;
export declare const VERSION: string;

export type Platform = "x" | "bluesky" | "linkedin" | "linkedin_page" | "mastodon" | "telegram" | "threads" | "facebook" | "instagram" | "youtube" | "tiktok" | "discord" | "slack" | "nostr" | "reddit" | "sandbox";
export type Scope = "posts:read" | "posts:write" | "accounts:read" | "accounts:write" | "admin";
/** The paid plan on sale: $10/mo for 10 active accounts, then $1 per extra active account. */
export type Plan = "pro";
/** Plans no longer sold; workspaces that subscribed before 2026-11-24 may still report one. */
export type LegacyPlan = "hobby" | "pro_v4" | "growth" | "scale";
export type PostStatus = "pending_approval" | "scheduled" | "publishing" | "published" | "partially_published" | "failed" | "canceled" | "deleted";
export type EventType =
  | "post.published"
  | "post.partially_published"
  | "post.failed"
  | "post.canceled"
  | "post.deleted"
  | "post.updated"
  | "post.approval_requested"
  | "post.approved"
  | "post.rejected"
  | "account.connected"
  | "account.needs_reauth"
  | "account.disconnected";

export interface Event {
  id: string;
  object: "event";
  type: EventType;
  created_at: string;
  data: Record<string, unknown>;
}

export interface PostReply {
  id: string;
  /** The post, or the reply this one answers. */
  parent_id: string | null;
  author: { handle: string | null; name: string | null; is_self: boolean };
  text: string;
  created_at: string | null;
  url: string | null;
  likes?: number;
}

export interface BatchResult {
  object: "batch";
  dry_run: boolean;
  total: number;
  succeeded: number;
  failed: number;
  results: { index: number; ok: boolean; status: number; post?: Post; preflight?: Preflight; error?: { code: string; message: string; fix?: string } }[];
}

export interface Issue {
  code: string;
  message: string;
  fix?: string;
  severity: "error" | "warning";
  account_id?: string;
  platform?: string;
  field?: string;
}

export declare class SocialsError extends Error {
  /** HTTP status, or 0 when the request never reached the API. */
  status: number;
  /** Stable machine-readable code, e.g. preflight_failed, rate_limited, insufficient_scope. */
  code: string;
  /** What to do about it. */
  fix?: string;
  /** Each failed check, for preflight_failed and validation_error. */
  issues?: Issue[];
  /** Quote this when asking for help. */
  requestId?: string;
  headers?: Record<string, string>;
}

export interface MediaItem {
  url: string;
  type?: "image" | "video" | "document";
  alt?: string;
  title?: string;
  thumbnail?: string;
}

export interface Poll {
  question?: string;
  options: string[];
  duration_minutes?: number;
  multiple?: boolean;
}

export interface PostLink {
  url: string;
  title?: string;
  description?: string;
  thumbnail?: string;
}

/** Per-network settings; every network also takes { text } to override the post's text. */
export interface PlatformOptions {
  x?: { text?: string; reply_settings?: "following" | "mentionedUsers" | "subscribers" | "verified" };
  bluesky?: { text?: string; langs?: string[] };
  mastodon?: { text?: string; visibility?: "public" | "unlisted" | "private" | "direct"; spoiler_text?: string; sensitive?: boolean; language?: string };
  telegram?: { text?: string; disable_notification?: boolean; protect_content?: boolean };
  linkedin?: { text?: string; visibility?: "PUBLIC" | "CONNECTIONS" | "LOGGED_IN" };
  linkedin_page?: { text?: string; visibility?: "PUBLIC" | "LOGGED_IN" };
  threads?: { text?: string; reply_control?: "everyone" | "accounts_you_follow" | "mentioned_only" | "parent_post_author_only" | "followers_only" };
  facebook?: { text?: string };
  instagram?: { text?: string; format?: "post" | "story"; share_to_feed?: boolean; cover_url?: string; thumb_offset?: number; audio_name?: string; collaborators?: string[] };
  youtube?: { text?: string; title?: string; privacy?: "public" | "unlisted" | "private"; tags?: string[]; category_id?: string; made_for_kids?: boolean; notify_subscribers?: boolean; contains_synthetic_media?: boolean };
  tiktok?: {
    text?: string;
    privacy_level?: "PUBLIC_TO_EVERYONE" | "MUTUAL_FOLLOW_FRIENDS" | "FOLLOWER_OF_CREATOR" | "SELF_ONLY";
    disable_comment?: boolean;
    disable_duet?: boolean;
    disable_stitch?: boolean;
    cover_timestamp_ms?: number;
    brand_organic?: boolean;
    brand_content?: boolean;
    ai_generated?: boolean;
  };
  discord?: { text?: string; username?: string; allow_mentions?: boolean };
  slack?: { text?: string };
  nostr?: { text?: string };
  reddit?: { text?: string; subreddit?: string; title?: string; flair_id?: string; nsfw?: boolean; spoiler?: boolean };
  sandbox?: { text?: string };
}

export interface CreatePostInput {
  /** Account ids (acc_...), or a network name when the workspace has exactly one active account on it. */
  accounts: string[];
  text?: string;
  media?: MediaItem[];
  link?: PostLink | null;
  thread?: { text: string; media?: MediaItem[] }[];
  /** Split text that is over a network's limit into a thread there instead of failing. */
  auto_thread?: boolean;
  reply_to?: string | null;
  /** With reply_to: the id of someone's reply under that post (from posts.replies), to answer them. One account. */
  reply_to_comment?: string | null;
  poll?: Poll | null;
  first_comment?: string | null;
  platform_options?: PlatformOptions;
  /** ISO-8601 with an offset, a local time together with timezone, or "best" for the hour that has worked best for these accounts. */
  scheduled_at?: string | null;
  /** Create a dated series: count posts, every N days/weeks/months, at the same local time. */
  repeat?: { every: "day" | "week" | "month"; interval?: number; count: number };
  timezone?: string;
  /** "required" holds the post until a person approves it from approval.url. */
  approval?: "required" | "none";
  /** Check every rule without publishing; returns a Preflight. */
  dry_run?: boolean;
  /** Publish before responding and return the final per-account result. */
  wait?: boolean;
  idempotency_key?: string;
  metadata?: Record<string, unknown>;
}

export type UpdatePostInput = Partial<Pick<CreatePostInput, "text" | "media" | "link" | "thread" | "auto_thread" | "poll" | "first_comment" | "platform_options" | "scheduled_at" | "timezone" | "metadata" | "dry_run">>;

export interface Approval {
  status: "pending" | "approved" | "rejected";
  /** Give this to the person who approves. */
  url: string;
  note: string | null;
  decided_at: string | null;
}

export interface Target {
  id: string;
  account_id: string;
  platform: Platform;
  status: "pending" | "publishing" | "published" | "failed" | "canceled" | "deleted";
  url: string | null;
  external_post_id: string | null;
  thread: { id: string; url: string | null }[];
  first_comment_id: string | null;
  attempts: number;
  next_attempt_at: string | null;
  published_at: string | null;
  deleted_at: string | null;
  verified: boolean;
  error: { code: string; message: string; fix?: string; retryable: boolean } | null;
}

export interface Post {
  id: string;
  object: "post";
  status: PostStatus;
  text: string;
  media: MediaItem[];
  link: PostLink | null;
  thread: { text: string; media: MediaItem[] }[];
  poll: Poll | null;
  first_comment: string | null;
  reply_to: string | null;
  reply_to_comment: string | null;
  auto_thread: boolean;
  series_id: string | null;
  /** Only on the response that created a repeat series. */
  series?: { id: string; count: number; posts: { id: string; status: PostStatus; scheduled_at: string }[] };
  approval: Approval | null;
  platform_options: PlatformOptions;
  scheduled_at: string | null;
  created_at: string;
  completed_at: string | null;
  metadata: Record<string, unknown>;
  targets: Target[];
  warnings?: Issue[];
}

export interface Preflight {
  object: "preflight";
  ok: boolean;
  issues: Issue[];
  /** The exact text each account would publish; thread holds the follow-ups when auto_thread splits it. */
  preview: { account_id: string; platform: Platform; text: string; thread?: string[] }[];
  /** For a repeat series: the dates each post would go out. */
  series?: { count: number; scheduled_at: string[] };
}

export interface PostList {
  object: "list";
  data: Post[];
  has_more: boolean;
  next_cursor: string | null;
}

export interface Account {
  id: string;
  object: "account";
  platform: Platform;
  handle: string | null;
  display_name: string | null;
  avatar_url: string | null;
  external_ref: string | null;
  status: "active" | "needs_reauth";
  connected_at: string;
}

export interface ConnectLink {
  id: string;
  object: "connect_link";
  /** Send this to the account owner. */
  url: string;
  start_urls: Record<string, string>;
  platforms: Platform[];
  external_ref: string | null;
  redirect_url: string | null;
  expires_at: string;
}

export interface ConnectLinkStatus {
  id: string;
  object: "connect_link_status";
  status: "connected" | "partially_connected" | "waiting" | "expired";
  connected: Account[];
  pending_platforms: Platform[];
  expires_at: string;
}

export interface PlatformInfo {
  id: Platform;
  name: string;
  available: boolean;
  in_review: boolean;
  connect: "oauth" | "credentials" | "instant";
  max_chars: number;
  max_images: number;
  /** Accepted image formats and size; anything else is converted to JPEG for you. */
  image: { formats: string[]; max_mb: number; note: string } | null;
  supports_video: boolean;
  video: { max_count: number; max_mb: number; with_images: boolean } | null;
  daily_post_cap: number;
  features: { threads: boolean; polls: boolean; documents: boolean; first_comment: boolean; delete: boolean; metrics: boolean; read_replies: boolean; link: "card" | "native" | "text" | "none" };
}

export interface Workspace {
  object: "workspace";
  id: string;
  name: string;
  plan: "free" | Plan | LegacyPlan;
  owner_email: string | null;
  created_at?: string;
}

export interface WorkspaceCreated extends Workspace {
  /** Shown once. The client starts using it automatically when it had no key. */
  api_key: string;
  note: string;
}

export interface Usage {
  object: "usage";
  period: { start: string; end: string };
  plan: { id: string; name: string; monthly_price: number; included_active_accounts: number; overage_per_account: number | null; monthly_post_limit: number | null; legacy?: boolean };
  active_accounts: number;
  posts: number;
  estimated_cost: number | null;
  x_api_fees: { used: number; included: number; billable: number; note: string };
  recommended_plan: { id: string; monthly_cost: number } | null;
  note: string;
}

export interface UpgradeLink {
  object: "upgrade_link";
  plan: Plan;
  kind: "checkout" | "portal";
  /** Give this to the workspace owner. */
  url: string;
  monthly_price: number;
  included_active_accounts: number;
  per_extra_active_account?: number | null;
  note: string;
}

export interface ApiKey {
  id: string;
  object: "api_key";
  name: string;
  prefix: string;
  current: boolean;
  scopes: Scope[] | null;
  account_ids: string[] | null;
  require_approval: boolean;
  daily_post_limit: number | null;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
  /** Only when the key is created. */
  key?: string;
}

export interface Webhook {
  id: string;
  object: "webhook_endpoint";
  url: string;
  events: (EventType | "*")[];
  /** Only when the endpoint is created. */
  secret?: string;
}

export interface PostMetrics {
  views?: number;
  likes?: number;
  reposts?: number;
  replies?: number;
  quotes?: number;
  bookmarks?: number;
  shares?: number;
  saves?: number;
  reach?: number;
  clicks?: number;
}

export interface Analytics {
  object: "analytics";
  period: { from: string; to: string; timezone: string };
  posts_published: number;
  posts_measured: number;
  totals: PostMetrics;
  engagement: number;
  engagement_per_post: number | null;
  by_account: { account_id: string; platform: Platform; name: string | null; posts: number; measured: number; totals: PostMetrics; engagement: number; engagement_per_post: number | null }[];
  top_posts: { post_id: string; account_id: string; platform: Platform; url: string | null; published_at: string; text: string; engagement: number; metrics: PostMetrics }[];
  /** Day-and-hour slots (in period.timezone) whose posts drew the most engagement. */
  best_times: { day: string; hour: number; posts: number; avg_engagement: number }[];
  note: string;
}

export interface Health {
  object: "status";
  status: "operational" | "degraded" | "outage";
  checked_at: string;
  components: { api: string; database: string; publisher: string };
  publisher: { last_run_seconds_ago: number | null; overdue_deliveries: number };
  networks: { id: string; name: string; available: boolean; note: string | null; delivered_24h: number | null; success_rate_24h: number | null; status: string }[];
}

export interface ClientOptions {
  /** An API key (sk_...). Falls back to SOCIALSFORAI_API_KEY in Node. */
  apiKey?: string;
  /** Defaults to https://socialsforai.com. */
  baseUrl?: string;
  /** Retries for rate limits, 5xx and network errors. Default 2. */
  maxRetries?: number;
  /** Per-request timeout in ms. Default 330000. */
  timeoutMs?: number;
  fetch?: typeof fetch;
}

export declare class SocialsForAI {
  constructor(options?: ClientOptions);
  apiKey: string | undefined;
  baseUrl: string;
  /** The rate limit as of the last response. */
  rateLimit: { limit: number; remaining: number; reset: number } | null;

  workspaces: { create(body?: { name?: string; email?: string }): Promise<WorkspaceCreated> };
  workspace: { get(): Promise<Workspace>; update(body: { email: string }): Promise<Workspace> };
  usage: { get(): Promise<Usage> };
  analytics: { get(params?: { days?: number; from?: string; to?: string; account_id?: string; platform?: Platform; timezone?: string; limit?: number }): Promise<Analytics> };
  platforms: { list(): Promise<PlatformInfo[]> };
  health: { get(): Promise<Health> };
  upgradeLinks: { create(body?: { plan?: Plan }): Promise<UpgradeLink> };

  accounts: {
    list(params?: { platform?: Platform; external_ref?: string; status?: "active" | "needs_reauth" }): Promise<Account[]>;
    get(id: string): Promise<Account>;
    connect(body: { platform: "bluesky" | "mastodon" | "telegram" | "discord" | "slack" | "nostr" | "sandbox"; credentials: Record<string, string>; external_ref?: string }): Promise<Account>;
    disconnect(id: string): Promise<Account>;
  };

  connectLinks: {
    create(body?: { platforms?: Platform[]; external_ref?: string; redirect_url?: string; expires_in?: number }): Promise<ConnectLink>;
    get(id: string, options?: { waitSeconds?: number; until?: "all" | "any" }): Promise<ConnectLinkStatus>;
    waitFor(id: string, options?: { until?: "all" | "any"; timeoutMs?: number }): Promise<ConnectLinkStatus>;
  };

  posts: {
    create(body: CreatePostInput & { dry_run: true }, options?: { idempotencyKey?: string }): Promise<Preflight>;
    create(body: CreatePostInput, options?: { idempotencyKey?: string }): Promise<Post>;
    list(params?: { status?: PostStatus; series_id?: string; limit?: number; before?: string }): Promise<PostList>;
    /** Up to 50 posts in one request; each is checked and created by itself. */
    createMany(body: { posts: CreatePostInput[]; dry_run?: boolean }, options?: { idempotencyKey?: string }): Promise<BatchResult>;
    get(id: string): Promise<Post>;
    update(id: string, body: UpdatePostInput & { dry_run: true }): Promise<Preflight>;
    update(id: string, body: UpdatePostInput): Promise<Post>;
    /** series: true also cancels the rest of a repeat series that hasn't gone out. */
    delete(id: string, options?: { accounts?: string[]; series?: boolean }): Promise<Post & { series_canceled?: number }>;
    /** What people replied under each published copy (Bluesky, Mastodon, Reddit today). */
    replies(id: string): Promise<{ object: "post_replies"; post_id: string; total: number; targets: { target_id: string; account_id: string; platform: Platform; url: string | null; replies: PostReply[]; fetched_at: string | null; error: { code: string; message: string; fix?: string } | null }[] }>;
    metrics(id: string): Promise<{ object: string; post_id: string; totals: PostMetrics; targets: { target_id: string; account_id: string; platform: Platform; url: string | null; metrics: PostMetrics | null; fetched_at: string | null; error: { code: string; message: string; fix?: string } | null }[] }>;
    waitForApproval(id: string, options?: { timeoutMs?: number }): Promise<Post>;
  };

  media: {
    upload(data: Uint8Array | ArrayBuffer | Blob | string, contentType?: string): Promise<{ url: string }>;
    createUpload(body: { content_type: string; size_bytes?: number }): Promise<{ upload_url: string; method: "PUT"; headers: Record<string, string>; url: string }>;
    uploadLarge(data: Uint8Array | ArrayBuffer | Blob, contentType: string): Promise<{ url: string }>;
  };

  events: {
    /** What happened since `after` (an event id), oldest first. waitSeconds holds the request until something arrives. */
    list(params?: { after?: string; types?: EventType[]; limit?: number; waitSeconds?: number }): Promise<{ object: "list"; data: Event[]; has_more: boolean; last_id: string | null }>;
  };

  webhooks: {
    list(): Promise<Webhook[]>;
    create(body: { url: string; events?: (EventType | "*")[] }): Promise<Webhook>;
    delete(id: string): Promise<{ id: string; object: "webhook_endpoint"; deleted: true }>;
  };

  keys: {
    list(): Promise<ApiKey[]>;
    create(body?: { name?: string; scopes?: Scope[]; account_ids?: string[]; require_approval?: boolean; daily_post_limit?: number }): Promise<ApiKey & { key: string }>;
    revoke(id: string): Promise<ApiKey & { revoked: true }>;
  };

  request<T = unknown>(method: string, path: string, options?: { body?: unknown; raw?: BodyInit; headers?: Record<string, string>; auth?: boolean }): Promise<T>;
}

/** Check a webhook's Socials-Signature header against the raw body. */
export declare function verifyWebhook(secret: string, header: string | null | undefined, rawBody: string | Uint8Array, options?: { toleranceSeconds?: number; now?: number }): Promise<boolean>;

export default SocialsForAI;
