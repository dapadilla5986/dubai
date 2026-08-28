# Pixel Agents

A live pixel art visualization of Claude Code agents working in real time. Built for developers who want to show their AI workflow in an engaging, retro-game style.


> Sprites by [pablodelucca](https://github.com/pablodelucca/pixel-agents) (MIT)

---

![Pixel Agents preview](public/pixel-agents-office-v2.webp)

## What it does

- Reads Claude Code's session `.jsonl` files in real time
- Renders animated pixel art agents that react to what Claude is doing: reading, editing, running commands, thinking, spawning sub-agents
- Multi-agent support: each active agent gets its own character that walks to a desk and animates
- Broadcast toggle: control when the visualization is visible publicly

## Requirements

- Docker + Docker Compose
- Claude Code running on the same machine or server

## Quick start

```bash
git clone https://github.com/YOUR_USERNAME/pixel-agents.git
cd pixel-agents
```

Edit `docker-compose.yml` and set `CLAUDE_JSONL_DIR` to match where Claude Code writes its session files:

```yaml
environment:
  - CLAUDE_JSONL_DIR=/dot-claude/projects/-root
```

Then:

```bash
docker compose up -d --build
```

Open `http://localhost:3000` — you'll see your agents live.

## Configuration

See [CLAUDE.md](CLAUDE.md) for full setup instructions. You can also pass `CLAUDE.md` directly to Claude Code and ask it to configure everything automatically.

```
Tell Claude Code: "Read CLAUDE.md and help me set up Pixel Agents"
```

## How it works

Claude Code writes conversation logs to `~/.claude/projects/<path>/`. This app mounts that directory read-only and tails the `.jsonl` files via a Server-Sent Events endpoint — no plugins, no hooks required.

## Project structure

```
src/app/
├── api/pixel-agents/
│   ├── agents-stream/route.ts   ← SSE endpoint (reads Claude Code logs)
│   └── broadcast/route.ts       ← public visibility toggle
└── pixel-agents/
    ├── AgentDataContext.tsx      ← SSE client + state management
    ├── DeskCanvas.tsx            ← desk view (6 seats)
    ├── OfficeCanvas.tsx          ← multi-floor office building
    ├── layout.tsx
    └── page.tsx
```

## Credits

- Pixel art sprites: [pablodelucca/pixel-agents](https://github.com/pablodelucca/pixel-agents) (MIT)
- Built with Next.js 16, Tailwind CSS, TypeScript

## License

MIT © Vasyl Pavlyuchok — see [LICENSE](LICENSE)

---

[README en Español](README.es.md)
