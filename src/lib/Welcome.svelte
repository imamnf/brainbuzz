<script lang="ts">
  import { screen } from "@/state/layout";
  import { questionState } from "@/state/question";
  import { quizState } from "@/state/quiz";

  let isDifficultyAvailable = $state(true);

  function checkDifficulty() {
    if (!$questionState.level) {
      isDifficultyAvailable = false; // Show warning
      return;
    }

    isDifficultyAvailable = true; // Clear warning if valid
    $quizState.isStart = true;
    $screen = "quiz";
  }
</script>

<div
  class="flex flex-col min-h-[calc(100vh-4rem)] justify-center items-center gap-y-12 p-4 -translate-y-12"
>
  <div class="flex flex-col items-center gap-y-4">
    <h3 class="text-xl font-semibold">Select Difficulty:</h3>
    <div class="flex flex-col gap-8 items-center">
      <button
        class={[
          "bg-green-300 btn hover:-translate-y-0.5",
          $questionState.level === "easy" &&
            "!shadow-[-0.25rem_0.25rem_0_0_#000000] translate-y-[10px]",
        ]}
        onclick={() => ($questionState.level = "easy")}
      >
        Easy
      </button>
      <button
        class={[
          "bg-yellow-300 btn hover:-translate-y-0.5",
          $questionState.level === "medium" &&
            "!shadow-[-0.25rem_0.25rem_0_0_#000000] translate-y-[10px]",
        ]}
        onclick={() => ($questionState.level = "medium")}
      >
        Medium
      </button>
      <button
        class={[
          "bg-red-300 btn hover:-translate-y-0.5",
          $questionState.level === "hard" &&
            "!shadow-[-0.25rem_0.25rem_0_0_#000000] translate-y-[10px]",
        ]}
        onclick={() => ($questionState.level = "hard")}
      >
        Hard
      </button>
    </div>
  </div>
  <div class="mt-8">
    <button
      class="bg-dodger-blue-300 btn hover:shadow-[-0.25rem_0.25rem_0_0_#000000] translate-y-[10px] hover:-translate-y-1"
      onclick={checkDifficulty}
    >
      Start Quiz
    </button>

    {#if !isDifficultyAvailable}
      <div class="mt-12 text-center text-red-500">Select Difficulty First!</div>
    {/if}
  </div>
</div>
