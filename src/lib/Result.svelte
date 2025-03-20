<script lang="ts">
  import { quizState } from "@/state/quiz";
  import { screen } from "@/state/layout";

  function handleRestartQuiz() {
    quizState.set({
      isComplete: false,
      isStart: false,
      score: 0,
      total: 0,
    });

    $screen = "welcome";
  }
</script>

<div
  class={[
    "flex flex-col justify-center items-center min-h-[calc(100vh-4rem)] px-4 text-center",
    $quizState.isComplete && "bg-dodger-blue-200",
  ]}
>
  <h1 class="text-3xl font-bold text-dodger-blue-500 mb-4">
    🎉 Quiz Complete!
  </h1>
  <p class="mb-8 text-lg">
    You scored <strong>{$quizState.score}</strong> out of 10
  </p>

  <button
    class="bg-dodger-blue-300 btn !hover:shadow-[0.25rem_0.25rem_0_0_#000000] translate-y-[10px]"
    onclick={handleRestartQuiz}
  >
    Restart Quiz
  </button>
</div>
