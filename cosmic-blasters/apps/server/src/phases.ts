/**
 * Phase definitions for Cosmic Blasters.
 *
 * Three phases: lobby, playing, gameOver
 *
 * VGF 4.8.0: Reducers cannot modify state.phase (PhaseModificationError).
 * Phase transitions use the WoF pattern: TRANSITION_TO_PHASE thunk dispatches
 * SET_NEXT_PHASE reducer. endIf checks hasNextPhase, next returns nextPhase.
 * Every phase's onBegin clears nextPhase via CLEAR_NEXT_PHASE.
 */
import type { CosmicBlastersState } from "@cosmic-blasters/shared"

/** VGF IGameActionContext-compatible shape */
interface GameActionContext {
    session: { state: CosmicBlastersState }
}

/** VGF IOnBeginContext — session, reducerDispatcher, getState, logger */
interface PhaseLifecycleContext {
    session: { sessionId: string; state: CosmicBlastersState }
    getState: () => CosmicBlastersState
    reducerDispatcher: (name: string, ...args: unknown[]) => void
    logger: {
        info: (...args: unknown[]) => void
        error: (...args: unknown[]) => void
    }
}

interface Phase {
    actions: Record<string, unknown>
    reducers: Record<string, unknown>
    thunks: Record<string, unknown>
    onBegin?: (ctx: unknown) => Promise<void>
    onEnd?: (ctx: unknown) => Promise<void>
    endIf: ((ctx: GameActionContext) => boolean) | undefined
    next: string | ((ctx: GameActionContext) => string)
}

/**
 * WoF pattern: true when a thunk has requested a transition to a DIFFERENT phase.
 */
function hasNextPhase(state: CosmicBlastersState): boolean {
    return state.nextPhase !== null && state.nextPhase !== state.phase
}

export function createPhases(): Record<string, Phase> {
    return {
        lobby: {
            actions: {},
            reducers: {},
            thunks: {},
            onBegin: async (ctx: unknown) => {
                const c = ctx as PhaseLifecycleContext
                c.reducerDispatcher("CLEAR_NEXT_PHASE", {})
                // Reset controllerConnected so lobby doesn't immediately cascade
                // to playing when returning via Play Again
                c.reducerDispatcher("SET_CONTROLLER_CONNECTED", { connected: false })
            },
            endIf: (ctx) =>
                ctx.session.state.controllerConnected ||
                hasNextPhase(ctx.session.state),
            next: (ctx) => {
                if (hasNextPhase(ctx.session.state))
                    return ctx.session.state.nextPhase!
                return "playing"
            },
        },

        playing: {
            actions: {},
            reducers: {},
            thunks: {},
            onBegin: async (ctx: unknown) => {
                const c = ctx as PhaseLifecycleContext
                c.reducerDispatcher("CLEAR_NEXT_PHASE", {})
            },
            endIf: (ctx) => hasNextPhase(ctx.session.state),
            next: (ctx) => {
                if (hasNextPhase(ctx.session.state))
                    return ctx.session.state.nextPhase!
                return "gameOver"
            },
        },

        gameOver: {
            actions: {},
            reducers: {},
            thunks: {},
            onBegin: async (ctx: unknown) => {
                const c = ctx as PhaseLifecycleContext
                c.reducerDispatcher("CLEAR_NEXT_PHASE", {})
            },
            endIf: (ctx) => hasNextPhase(ctx.session.state),
            next: (ctx) => {
                if (hasNextPhase(ctx.session.state))
                    return ctx.session.state.nextPhase!
                return "lobby"
            },
        },
    }
}
