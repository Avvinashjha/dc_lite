**OpenClaw** is an open-source personal AI assistant that runs on your own machine and can execute real tasks: managing files, controlling browsers, sending messages, and automating workflows. Unlike cloud chatbots that only suggest actions, OpenClaw actually does them. In this post we cover what OpenClaw is, how to use it, what it can do, precautions to take, how it helps, and its applications.

## What Is OpenClaw?

OpenClaw is a self-hosted gateway that connects your favorite chat apps (WhatsApp, Telegram, Discord, Slack, Signal, iMessage, and more) to an AI assistant. You run a single Gateway process on your own machine or server, and it becomes the bridge between your messaging apps and an always-available AI that can act on your behalf.

**Key points:**

- **Self-hosted** – Runs on your Mac, Windows, or Linux. Your data stays on your machine.
- **Agent-native** – Built for AI agents with tool use, sessions, memory, and multi-agent routing.
- **Multi-channel** – One Gateway serves WhatsApp, Telegram, Discord, and more at once.
- **Open source** – MIT licensed, hosted on [GitHub](https://github.com/openclaw/openclaw) with 260,000+ stars and 900+ contributors.

**Who is it for?** Developers and power users who want a personal AI assistant they can message from anywhere, without giving up control of their data or relying on a hosted service.

## How to Use OpenClaw

### Installation

**Requirements:** Node.js 22 or higher.

**macOS / Linux (one-liner):**

```bash
curl -sSL https://openclaw.ai/install.sh | bash
```

**Windows (PowerShell):**

```powershell
& ([scriptblock]::Create((iwr -useb https://openclaw.ai/install.ps1))) -Tag beta
```

**Or via npm / pnpm:**

```bash
npm install -g openclaw@latest
# or
pnpm add -g openclaw@latest
```

The install script handles Node.js, Python, and the OpenClaw CLI.

### Onboarding

```bash
openclaw onboard --install-daemon
```

The wizard guides you through:

- API key setup (Anthropic, OpenAI, or local models via Ollama)
- Chat platform configuration
- Optional skill installation

### Start the Gateway

```bash
openclaw channels login   # Pair WhatsApp, Telegram, etc.
openclaw gateway --port 18789
```

### Control UI

After the Gateway starts, open the browser dashboard at [http://127.0.0.1:18789/](http://127.0.0.1:18789/) for chat, config, and sessions. You can also access it remotely via SSH or Tailscale.

### Configuration

Config lives at `~/.openclaw/openclaw.json`. Example to restrict who can use the agent:

```json
{
  "channels": {
    "whatsapp": {
      "allowFrom": ["+15555550123"],
      "groups": { "*": { "requireMention": true } }
    }
  },
  "messages": { "groupChat": { "mentionPatterns": ["@openclaw"] } }
}
```

## What Can OpenClaw Do?

![OpenClaw capabilities: Chat apps, Browser, Files + Shell, Skills](/blog/introduction-to-openclaw/capabilities.svg)

- **Runs on your machine** – Mac, Windows, or Linux. Works with Anthropic Claude, OpenAI, or local models (Ollama). Private by default.

- **Any chat app** – WhatsApp, Telegram, Discord, Slack, Signal, iMessage, Microsoft Teams, Matrix. DMs and group chats with mention-based activation.

- **Persistent memory** – Remembers you and evolves over time. Preferences, context, and a personalized assistant.

- **Browser control** – Navigate the web, fill forms, extract data from websites automatically.

- **Full system access** – Read and write files, execute shell commands, run scripts. You can choose full access or sandboxed mode.

- **Skills and plugins** – 100+ AgentSkills for shell commands, file management, web automation, and 50+ third-party services (smart home, productivity, music). You can create your own or let the AI build new skills.

- **Multi-agent routing** – Isolated sessions per agent, workspace, or sender.

## Precautions to Take

OpenClaw has significant power. It can run shell commands, access files, and control your browser. Take these precautions:

### 1. Use Sandbox Mode

Enable sandboxing to limit what the agent can do:

```yaml
# In openclaw.yaml or config.yaml
sandbox: true
```

When enabled:

- System-level operations (installing packages, modifying system files) are blocked
- Shell commands are filtered through an allowlist
- File system access is restricted to a workspace directory (e.g. `~/.openclaw/workspace/`)

**Sandbox modes:**

- `"all"` – Every session runs in a sandbox
- `"non-main"` – Only non-main sessions (groups/channels) are sandboxed (default)
- `"off"` – No sandboxing (use only if you fully trust the setup)

### 2. Restrict File System Access

Block sensitive directories from agent access:

| Directory | Why |
|-----------|-----|
| `~/.ssh` | SSH keys could be exfiltrated |
| `~/.aws` | AWS credentials in plaintext |
| `~/.config` | App configs often contain tokens |
| `~/.gnupg` | GPG keys |
| `~/.kube` | Kubernetes configs with cluster access |
| `/etc` | System configuration files |

Use `allowedPaths`, `blockedPaths`, and `readOnly` in your config to control access.

### 3. Restrict Who Can Talk to the Agent

Use `channels.whatsapp.allowFrom` (and similar for other channels) to allow only specific numbers. In groups, use `requireMention: true` so the agent responds only when mentioned.

### 4. Run in Docker for Stronger Isolation

For production or shared environments, run OpenClaw in Docker with resource limits and restricted mounts:

```bash
docker run -d \
  --name openclaw \
  -v ~/.openclaw/config:/app/config:ro \
  -v ~/.openclaw/workspace:/app/workspace \
  -p 127.0.0.1:3000:3000 \
  --memory=2g \
  --cpus=1.5 \
  openclaw/openclaw:latest
```

### 5. Secure API Keys and Credentials

Store API keys securely. Do not expose the Gateway to the public internet without authentication. Use the security docs for tokens, allowlists, and tool policies.

### 6. Vet Community Skills

Before installing skills from the community, review what they do. Skills can execute code and access resources. Prefer official or well-vetted skills.

**Note:** Sandboxing is not a perfect security boundary, but it materially limits the blast radius if something goes wrong (prompt injection, buggy skill, misconfigured tool).

## How OpenClaw Can Help

- **Automate inbox and calendar** – Triage email, draft replies, schedule meetings, resolve conflicts.
- **Code and DevOps** – Refactor codebases, write tests, deploy to Kubernetes, optimize queries, run security audits.
- **Research and content** – Track earnings, monitor competitors, generate summaries, draft blog posts and newsletters.
- **Personal productivity** – Daily briefings (calendar, news, weather), document Q&A, task management.
- **24/7 availability** – Run it on a Mac mini or server so it is always on across all your devices and chat platforms.

## Applications and Use Cases

### Personal Productivity

- Email management (inbox triage, drafts, follow-ups)
- Calendar management (scheduling, conflict resolution, meeting prep)
- Daily briefings (calendar, news, weather)
- Document Q&A (chat with personal notes and files)

### Business and Enterprise

- **Customer support** – First-line FAQ handling, order status, escalation
- **Sales development** – Automated outreach, lead qualification, meeting booking
- **Financial monitoring** – Payment tracking, failed transactions, revenue summaries
- **Data reporting** – Automated analytics, metrics, weekly reports
- **CRM integration** – Pipeline analysis, deal updates

### Content and Research

- Content creation (blogs, YouTube summaries, newsletters, social media)
- Research automation (earnings reports, competitor analysis, trending content)
- Web scraping and competitive intelligence

### Development and DevOps

- Code refactoring (e.g. React to TypeScript, Python to Rust)
- Automated testing, documentation, PR reviews
- Kubernetes deployment, ingress, microservices
- Database optimization (query analysis, indexes)
- Security audits (SQL injection, XSS, input sanitization)

### Advanced

- Crypto trading alerts and automation
- Home automation (smart devices)
- ETL pipelines, schema migrations, monitoring dashboards

## Cost

OpenClaw software is free and open-source (MIT). Costs come from AI model APIs:

- **Light use:** $10–30/month
- **Typical use:** $30–70/month
- **Heavy automation:** $100–150/month or more

You can reduce costs by using local models via Ollama (free) or the Brave Search free tier (2,000 requests/month) for web search. **Note:** Using Claude Pro/Max subscriptions violates Anthropic's TOS; use API keys with pay-as-you-go pricing.

## Summary

- **What:** OpenClaw is a self-hosted AI assistant that runs on your machine and executes real tasks via chat apps.
- **How to use:** Install via one-liner or npm, run `openclaw onboard --install-daemon`, pair channels, start the Gateway.
- **What it can do:** Browser control, file system access, shell commands, persistent memory, 100+ skills, multi-channel chat.
- **Precautions:** Enable sandbox mode, block sensitive directories, restrict who can talk to the agent, consider Docker, vet community skills.
- **How it helps:** Inbox/calendar automation, code and DevOps, research, content creation, 24/7 availability.
- **Applications:** Personal productivity, customer support, sales, reporting, development, security audits, and more.

OpenClaw is designed for developers and power users who want an AI that actually does things, on their own hardware, with their data under their control. Start with sandbox mode and restrictive config, then expand access as you gain confidence.
