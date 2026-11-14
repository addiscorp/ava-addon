// Types for Ava's add-on client (src-tauri/src/addons/ava.js, served at
// /ava.js) and for an add-on's manifest.json (src-tauri/src/addons/manifest.rs).

/** A folder or file the person gave this add-on in Ava's picker. */
export type Grant = { token: string; name: string; kind: 'folder' | 'file' }

/** One entry in a granted folder. */
export type Entry = { name: string; path: string; kind: 'folder' | 'file'; size: number; modified: number }

/** An MCP transport over Ava's bridge, for the MCP Apps SDK: `new App(…).connect(ava().transport())`. */
export type Transport = {
  onmessage?: (message: unknown) => void
  onerror?: (error: Error) => void
  onclose?: () => void
  start(): Promise<void>
  send(message: unknown): Promise<void>
  close(): Promise<void>
}

export type AvaClient = {
  /** One JSON-RPC request to Ava (MCP, MCP Apps, or Ava's own `ava/` methods). */
  request(method: string, params?: Record<string, unknown>): Promise<unknown>
  notify(method: string, params?: Record<string, unknown>): Promise<unknown>
  transport(): Transport
  /** Hear a notification by its method (e.g. 'notifications/roots/list_changed', 'ava/notifications/open'). */
  on(method: string, fn: (params: Record<string, unknown>) => void): () => void
  /** Who this add-on is, as Ava knows it. */
  hello(): Promise<{ id: string; name: string; version: string }>
  /** What the person gave this add-on, as MCP roots (URIs in this add-on's origin). */
  roots(): Promise<{ roots: { uri: string; name?: string }[] }>
  pickFolder(): Promise<Grant>
  pickFiles(options?: { multiple?: boolean }): Promise<Grant[]>
  grants(): Promise<Grant[]>
  files: {
    list(token: string, path?: string): Promise<Entry[]>
    stat(token: string, path: string): Promise<Entry>
    read(token: string, path: string, options?: { encoding?: 'utf8' | 'base64' }): Promise<string>
    write(token: string, path: string, data: string, options?: { encoding?: 'utf8' | 'base64' }): Promise<Entry>
    mkdir(token: string, path: string): Promise<Entry>
    rename(token: string, from: string, to: string): Promise<Entry>
    /** To the Trash. */
    delete(token: string, path: string): Promise<void>
    /** A URL for <img>, <audio>, <video>, streamed by Ava by range. */
    url(token: string, path?: string): string
  }
  storage: {
    get(key: string): Promise<unknown>
    set(key: string, value: unknown): Promise<void>
    delete(key: string): Promise<void>
    keys(): Promise<string[]>
  }
  /** A link in the person's browser (Ava asks first unless it's a declared host). */
  openExternal(url: string): Promise<void>
  net: {
    /** A request to one of the add-on's declared hosts, through Ava. */
    fetch(url: string, init?: { method?: string; headers?: Record<string, string>; body?: string | null }): Promise<{ status: number; headers: Record<string, string>; body: string }>
  }
}

/** Ava's client, as /ava.js set it up. Throws outside Ava. */
export function ava(): AvaClient

/** What one of an add-on's tools does: reads, changes its own files, or reaches outside (Ava asks the person). */
export type Effect = 'read' | 'inside' | 'outside'
export type Permission = 'files' | 'storage' | 'tools' | 'network'
/**
 * With the 'files' permission, whether the add-on's tools need a picked folder or file:
 * 'needed' (the default) means Ava offers them only once the person picked one;
 * 'optional' means they work without, and the add-on only sometimes asks for files.
 */
export type FilesUse = 'needed' | 'optional'

/** manifest.json at the root of an add-on's bundle. */
export type Manifest = {
  /** 3–32 of a–z, 0–9 and '-'; `ava`, `ava-*`, `addis-*` and `marketplace` are Ava's. */
  id: string
  name: string
  version: string
  description?: string
  /** The page Ava opens (default index.html). */
  entry?: string
  icon?: string
  permissions?: Permission[]
  /** Only with the 'files' permission; left out, it's 'needed'. */
  files?: FilesUse
  /** Hosts it may reach through `ava.net.fetch` (needs 'network'). */
  egress?: string[]
  tools?: { name: string; description: string; effect: Effect; input_schema: Record<string, unknown> }[]
}
