import { writable } from "svelte/store";

export const quizState = writable({
  isStart: false,
  isComplete: false,
  score: 0,
  total: 0
})