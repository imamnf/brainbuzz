<script lang="ts">
  import type { Difficulty, Screen } from "@/types/index.types";
  import Header from "./lib/app/Header.svelte";
  import Quiz from "./lib/Quiz.svelte";
  import Welcome from "./lib/Welcome.svelte";
  import Result from "./lib/Result.svelte";

  let screen = $state<Screen>("welcome");
  let difficulty = $state<Difficulty | null>(null);
  let score = $state(0);
  let total = $state(0);

  function selectDifficulty(value: Difficulty) {
    difficulty = value;
  }
  function startQuiz() {
    screen = "quiz";
  }
  function restartQuiz() {
    screen = "welcome";
    score = 0;
    total = 0;
  }
  function onComplete(newScore: number, newTotal: number) {
    score = newScore;
    total = newTotal;
    screen = "result";
  }
</script>

<Header />

{#if screen === "welcome"}
  <Welcome
    {difficulty}
    onSelectDifficulty={selectDifficulty}
    onStartQuiz={startQuiz}
  />
{/if}

{#if screen === "quiz"}
  <Quiz {difficulty} setComplete={onComplete} />
{/if}

{#if screen === "result"}
  <Result {score} totalQuestions={total} onRestartQuiz={restartQuiz} />
{/if}
