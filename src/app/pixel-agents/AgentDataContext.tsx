"use client";

import { createContext, useContext, useEffect, useReducer, useRef } from "react";
import type { AgentRole, MultiAgentState } from "@/app/api/pixel-agents/agents-stream/route";

export type { AgentRole, MultiAgentState };

export interface AgentEntry {
  agentId: string;
  role: AgentRole;
  sessionId: string;
  state: MultiAgentState;
  tool?: string;
  detail?: string;
  lastSeen: string;
  agentType?: string;
}

type AgentDataState = {
  agents: Map<string, AgentEntry>;
  connected: boolean;
  activeSessionId: string | null;
};

type Action =
  | { type: "connected" }
  | { type: "disconnected" }
  | { type: "snapshot"; entries: AgentEntry[] }
  | { type: "update"; entry: AgentEntry }
  | { type: "agent_end"; agentId: string }
  | { type: "session_change"; sessionId: string };

function reducer(state: AgentDataState, action: Action): AgentDataState {
  switch (action.type) {
    case "connected": return { ...state, connected: true };
    case "disconnected": return { ...state, connected: false };
    case "session_change": return { agents: new Map(), connected: state.connected, activeSessionId: action.sessionId };
    case "snapshot": { const m = new Map<string, AgentEntry>(); action.entries.forEach((e) => m.set(e.agentId, e)); return { ...state, agents: m }; }
    case "update": { const m = new Map(state.agents); m.set(action.entry.agentId, action.entry); return { ...state, agents: m }; }
    case "agent_end": { const m = new Map(state.agents); m.delete(action.agentId); return { ...state, agents: m }; }
    default: return state;
  }
}

type AgentDataContextValue = AgentDataState & { dispatch: React.Dispatch<Action> };

const AgentDataContext = createContext<AgentDataContextValue>({
  agents: new Map(), connected: false, activeSessionId: null, dispatch: () => {},
});

export function AgentDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { agents: new Map(), connected: false, activeSessionId: null });
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource("/api/pixel-agents/agents-stream");
    esRef.current = es;
    es.onopen = () => dispatch({ type: "connected" });
    es.onerror = () => dispatch({ type: "disconnected" });
    es.addEventListener("snapshot", (e: MessageEvent) => dispatch({ type: "snapshot", entries: JSON.parse(e.data) as AgentEntry[] }));
    es.addEventListener("agent_update", (e: MessageEvent) => {
      const raw = JSON.parse(e.data) as { agentId: string; role: AgentRole; sessionId: string; state: MultiAgentState; tool?: string; detail?: string; timestamp: string; agentType?: string };
      dispatch({ type: "update", entry: { agentId: raw.agentId, role: raw.role, sessionId: raw.sessionId, state: raw.state, tool: raw.tool, detail: raw.detail, lastSeen: raw.timestamp, agentType: raw.agentType } });
    });
    es.addEventListener("agent_end", (e: MessageEvent) => dispatch({ type: "agent_end", agentId: (JSON.parse(e.data) as { agentId: string }).agentId }));
    es.addEventListener("session_change", (e: MessageEvent) => dispatch({ type: "session_change", sessionId: (JSON.parse(e.data) as { sessionId: string }).sessionId }));
    return () => es.close();
  }, []);

  return <AgentDataContext.Provider value={{ ...state, dispatch }}>{children}</AgentDataContext.Provider>;
}

export function useAgentData(): AgentDataContextValue {
  return useContext(AgentDataContext);
}
