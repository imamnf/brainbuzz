<script lang="ts">
  interface ResultProps {
    score: number;
    totalQuestions: number;
    onRestartQuiz: () => void;
  }
  const { score, totalQuestions, onRestartQuiz }: ResultProps = $props();
</script>

<div
  class="flex flex-col justify-center items-center min-h-screen px-4 text-center"
>
  <h1 class="text-3xl font-bold text-dodger-blue-500 mb-4">
    🎉 Quiz Complete!
  </h1>
  <p class="mb-8 text-lg">
    You scored <strong>{score}</strong> out of {totalQuestions}
  </p>

  <button
    class="bg-dodger-blue-300 btn !hover:shadow-[0.25rem_0.25rem_0_0_#000000] translate-y-[10px]"
    onclick={onRestartQuiz}
  >
    Restart Quiz
  </button>
</div>
