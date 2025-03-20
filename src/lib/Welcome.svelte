<script lang="ts">
  interface WelcomeProps {
    difficulty: "easy" | "medium" | "hard" | null;
    onSelectDifficulty: (value: "easy" | "medium" | "hard") => void;
    onStartQuiz: () => void;
  }
  const { difficulty, onSelectDifficulty, onStartQuiz }: WelcomeProps =
    $props();

  let isDifficultyAvailable = $state(true);

  function checkDifficulty() {
    if (!difficulty) {
      isDifficultyAvailable = false; // Show warning
      return;
    }

    isDifficultyAvailable = true; // Clear warning if valid
    onStartQuiz(); // Start the quiz!
  }
</script>

<div class="flex flex-col min-h-screen justify-center items-center gap-y-12">
  <div class="flex flex-col items-center gap-y-4">
    <h3 class="text-xl font-semibold">Select Difficulty:</h3>
    <div class="flex gap-x-8 items-center">
      <button
        class={[
          "bg-green-300 btn",
          difficulty === "easy" &&
            "!shadow-[0.25rem_0.25rem_0_0_#000000] translate-y-[10px]",
        ]}
        onclick={() => onSelectDifficulty("easy")}
      >
        Easy
      </button>
      <button
        class={[
          "bg-yellow-300 btn",
          difficulty === "medium" &&
            "!shadow-[0.25rem_0.25rem_0_0_#000000] translate-y-[10px]",
        ]}
        onclick={() => onSelectDifficulty("medium")}
      >
        Medium
      </button>
      <button
        class={[
          "bg-red-300 btn",
          difficulty === "hard" &&
            "!shadow-[0.25rem_0.25rem_0_0_#000000] translate-y-[10px]",
        ]}
        onclick={() => onSelectDifficulty("hard")}
      >
        Hard
      </button>
    </div>
  </div>
  <div class="mt-8">
    <button
      class="bg-dodger-blue-300 btn hover:shadow-[0.25rem_0.25rem_0_0_#000000] translate-y-[10px]"
      onclick={checkDifficulty}
    >
      Start Quiz
    </button>

    {#if !isDifficultyAvailable}
      <div class="mt-12 text-center text-red-500">Select Difficulty First!</div>
    {/if}
  </div>
</div>
