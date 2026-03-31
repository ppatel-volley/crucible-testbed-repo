import type { CosmicBlastersState } from "@cosmic-blasters/shared"

/**
 * Pure reducers. ALL take (state, payload) pattern.
 * NONE modify state.phase — VGF 4.8+ throws PhaseModificationError.
 */
export const globalReducers: Record<
    string,
    (state: CosmicBlastersState, ...args: unknown[]) => CosmicBlastersState
> = {
    SET_NEXT_PHASE: (
        state: CosmicBlastersState,
        payload: unknown,
    ): CosmicBlastersState => {
        const { targetPhase } = payload as { targetPhase: string }
        return { ...state, nextPhase: targetPhase }
    },

    CLEAR_NEXT_PHASE: (state: CosmicBlastersState): CosmicBlastersState => {
        return { ...state, nextPhase: null }
    },

    SET_CONTROLLER_CONNECTED: (
        state: CosmicBlastersState,
        payload: unknown,
    ): CosmicBlastersState => {
        const { connected } = payload as { connected: boolean }
        return { ...state, controllerConnected: connected }
    },

    SET_QUESTION: (
        state: CosmicBlastersState,
        payload: unknown,
    ): CosmicBlastersState => {
        const {
            question,
            questionIndex,
            hintKeywords,
            timerStartedAt,
            timerDuration,
        } = payload as {
            question: string
            questionIndex: number
            hintKeywords: string[]
            timerStartedAt: number
            timerDuration: number
        }
        return {
            ...state,
            currentQuestion: question,
            questionIndex,
            hintKeywords,
            timerStartedAt,
            timerDuration,
            lastAnswerText: null,
            lastAnswerCorrect: null,
            transcript: "",
        }
    },

    SUBMIT_ANSWER: (
        state: CosmicBlastersState,
        payload: unknown,
    ): CosmicBlastersState => {
        const { text, correct, score } = payload as {
            text: string
            correct: boolean
            score: number
        }
        return {
            ...state,
            lastAnswerText: text,
            lastAnswerCorrect: correct,
            score,
        }
    },
}
