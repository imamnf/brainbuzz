import type { Difficulty } from "@/types/index.types"
import { writable } from "svelte/store"

interface QuizState {
  level: Difficulty | null
  timer: number
  timerInterval: ReturnType<typeof setInterval> | null
}
export const questionState = writable<QuizState>({
  level: null,
  timer: 0,
  timerInterval: null
})