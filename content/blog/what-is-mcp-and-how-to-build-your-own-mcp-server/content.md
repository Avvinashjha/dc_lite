AI assistants are useful, but without real context they quickly hit limits.

They do not automatically know your files, internal docs, project tools, or company systems.

That gap is exactly what MCP solves.

## What Is MCP?

`MCP` (Model Context Protocol) is an open protocol for connecting AI applications to external data and actions in a standardized way.

Think of it as a common language between:

- AI hosts/clients (like coding assistants, chat tools, IDE integrations)
- External systems (databases, APIs, file systems, internal tools)

Instead of writing one-off integrations for every AI app, you build an MCP server once and any MCP-compatible client can use it.

## What Is MCP Used For?

MCP is used to make AI systems actually useful in real workflows.

Typical use cases:

- Let an assistant read docs from an internal knowledge base
- Query project data from tools like Jira/GitHub/Notion
- Execute actions safely through exposed tools
- Reuse prompt templates for common team workflows
- Connect one AI client to many tools with a consistent protocol

In short: MCP turns isolated LLMs into context-aware assistants.

## Core MCP Concepts

MCP servers expose three primary building blocks:

### 1. Tools

Actions the model can call (similar to function calls).

Examples:

- `create_ticket`
- `run_sql_query`
- `deploy_preview`

### 2. Resources

Read-only context the model can fetch.

Examples:

- `docs://engineering/oncall-guide`
- `file://repo/README.md`

### 3. Prompts

Reusable prompt templates the client can discover and invoke.

Examples:

- `postmortem-template`
- `code-review-checklist`

## How MCP Works (End-to-End)

At runtime, the flow usually looks like this:

1. An MCP host (AI app) starts or connects to an MCP server.
2. Client and server negotiate capabilities.
3. The client lists available tools/resources/prompts.
4. The model decides when to call a tool or fetch a resource.
5. The server executes the request and returns structured results.
6. The host injects that result into the conversation context.

The protocol uses `JSON-RPC` messaging over transports like:

- `stdio` (local process communication)
- `Streamable HTTP` (remote/server deployments)

## MCP Architecture in One Mental Model

- Host: the AI application users interact with
- Client: connection manager inside the host
- Server: your integration layer exposing context/actions
- Transport: how messages move (`stdio` or HTTP)
- Protocol messages: JSON-RPC requests/responses/notifications

This separation is important: your MCP server focuses on domain logic, while the host handles model interaction and UI.

## How to Create Your Own MCP Server

Below is a practical TypeScript setup for a local `stdio` MCP server.

### Step 1: Initialize project

```bash
mkdir my-mcp-server && cd my-mcp-server
npm init -y
npm install @modelcontextprotocol/sdk zod
npm install -D typescript tsx @types/node
npx tsc --init
```

### Step 2: Create `server.ts`

```ts
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const server = new McpServer({
  name: "team-ops-server",
  version: "1.0.0",
});

server.tool(
  "sum_numbers",
  {
    a: z.number(),
    b: z.number(),
  },
  async ({ a, b }) => {
    const result = a + b;
    return {
      content: [{ type: "text", text: `Result: ${result}` }],
    };
  }
);

server.resource(
  "team-handbook",
  new ResourceTemplate("handbook://{section}", { list: undefined }),
  async (uri, { section }) => {
    const text = `Requested handbook section: ${section}`;
    return {
      contents: [{ uri: uri.href, text }],
    };
  }
);

server.prompt(
  "bug-triage",
  { title: z.string(), severity: z.enum(["low", "medium", "high"]) },
  async ({ title, severity }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Create a bug triage summary for: ${title}. Severity: ${severity}.`,
        },
      },
    ],
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

### Step 3: Add a run script

In `package.json`:

```json
{
  "scripts": {
    "dev": "tsx server.ts"
  }
}
```

### Step 4: Run server

```bash
npm run dev
```

Then configure your MCP-compatible client/host to launch this server over `stdio`.

## Local vs Remote MCP Server

Use `stdio` when:

- Server runs on the same machine as the AI client
- You want simplest setup and fast local communication

Use `Streamable HTTP` when:

- You need multi-user or shared deployment
- Server must run centrally (cloud/VPC)
- You need standard web auth patterns and remote access

## Security Checklist (Must-Do)

If you are building real integrations, treat MCP servers as production infrastructure:

- Validate all tool inputs strictly (schema + business rules)
- Enforce authN/authZ for sensitive operations
- Return least-privilege data only
- Add allow-lists for risky side effects
- Log every tool call with audit metadata
- For HTTP servers, validate `Origin` and bind safely for local setups

## Common Mistakes to Avoid

- Exposing tools that do too much without permission boundaries
- Returning unstructured free-text instead of predictable output shapes
- Mixing presentation text with machine-readable data
- Ignoring timeouts/retries for upstream APIs
- Shipping without observability (logs, tracing, tool metrics)

## Why MCP Adoption Is Growing

MCP gives teams a protocol-level contract.

That means:

- Faster integration development
- Reusable connectors across different AI clients
- Cleaner separation between model layer and business systems
- Better governance over what an AI assistant can read or do

If REST standardized web APIs for apps, MCP is becoming that standardization layer for AI context and actions.

## Final Thoughts

MCP is not just another AI buzzword. It is a practical integration protocol.

Use it when you want AI systems to work with real tools and real data, safely and consistently.

Start with one small server, expose one useful tool, test with real user workflows, and iterate from there.
