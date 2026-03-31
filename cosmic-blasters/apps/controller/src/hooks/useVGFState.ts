/**
 * VGF client hooks for the CONTROLLER app.
 *
 * Uses getVGFHooks() to create typed hooks bound to CosmicBlastersState.
 */
import {
    getVGFHooks,
    useConnectionStatus,
} from "@volley/vgf/client"
import type { CosmicBlastersState } from "@cosmic-blasters/shared"

const hooks = getVGFHooks<any, CosmicBlastersState, string>()

const useStateSync = hooks.useStateSync
const useStateSyncSelector = hooks.useStateSyncSelector
const useDispatch = hooks.useDispatch
const useDispatchThunk = hooks.useDispatchThunk as () => (thunkName: string, ...args: unknown[]) => void
const usePhase = hooks.usePhase
const useSessionMembers = hooks.useSessionMembers

export {
    useStateSync,
    useStateSyncSelector,
    useDispatch,
    useDispatchThunk,
    usePhase,
    useSessionMembers,
    useConnectionStatus,
}
