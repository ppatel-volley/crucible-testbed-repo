import type { ServerOnlyState } from "@cosmic-blasters/shared"

export interface GameServices {
    serverState: Map<string, ServerOnlyState>
}
