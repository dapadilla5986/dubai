# Pixel Agents

Visualización en tiempo real de agentes Claude Code con pixel art estilo retro. Diseñado para desarrolladores que quieren mostrar su flujo de trabajo con IA de forma visual y llamativa.

> Diseñado por **Vasyl Pavlyuchok** · [vasylpavlyuchok.com](https://vasylpavlyuchok.com)
> Sprites por [pablodelucca](https://github.com/pablodelucca/pixel-agents) (MIT)

---

![Vista previa de Pixel Agents](public/pixel-agents-office-v2.webp)

## Qué hace

- Lee los archivos `.jsonl` de sesión de Claude Code en tiempo real
- Renderiza agentes animados en pixel art que reaccionan a lo que hace Claude: leyendo, editando, ejecutando comandos, pensando, creando sub-agentes
- Soporte multi-agente: cada agente activo tiene su propio personaje que camina hasta un escritorio y se anima
- Toggle de broadcast: controla cuándo la visualización es visible públicamente

## Requisitos

- Docker + Docker Compose
- Claude Code corriendo en la misma máquina o servidor

## Inicio rápido

```bash
git clone https://github.com/TU_USUARIO/pixel-agents.git
cd pixel-agents
```

Edita `docker-compose.yml` y configura `CLAUDE_JSONL_DIR` para que apunte a donde Claude Code escribe sus archivos de sesión:

```yaml
environment:
  - CLAUDE_JSONL_DIR=/dot-claude/projects/-root
```

Luego:

```bash
docker compose up -d --build
```

Abre `http://localhost:3000` — verás tus agentes en vivo.

## Configuración

Consulta [CLAUDE.md](CLAUDE.md) para instrucciones completas. También puedes pasar el archivo `CLAUDE.md` directamente a Claude Code para que configure todo automáticamente:

```
Dile a Claude Code: "Lee CLAUDE.md y ayúdame a configurar Pixel Agents"
```

## Cómo funciona

Claude Code escribe los logs de conversación en `~/.claude/projects/<ruta>/`. Esta app monta ese directorio de solo lectura y lee los archivos `.jsonl` mediante un endpoint de Server-Sent Events — sin plugins ni hooks adicionales.

## Estructura del proyecto

```
src/app/
├── api/pixel-agents/
│   ├── agents-stream/route.ts   ← endpoint SSE (lee los logs de Claude Code)
│   └── broadcast/route.ts       ← toggle de visibilidad pública
└── pixel-agents/
    ├── AgentDataContext.tsx      ← cliente SSE + gestión de estado
    ├── DeskCanvas.tsx            ← vista de escritorio (6 puestos)
    ├── OfficeCanvas.tsx          ← edificio de oficina multi-planta
    ├── layout.tsx
    └── page.tsx
```

## Créditos

- Sprites pixel art: [pablodelucca/pixel-agents](https://github.com/pablodelucca/pixel-agents) (MIT)
- Construido con Next.js 16, Tailwind CSS, TypeScript

## Licencia

MIT © Vasyl Pavlyuchok — ver [LICENSE](LICENSE)

---

[README in English](README.md)
