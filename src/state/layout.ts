import type { Screen } from "@/types/index.types";
import { writable } from "svelte/store";

export const screen = writable<Screen>("welcome")