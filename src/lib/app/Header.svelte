<script lang="ts">
  import { questionState } from "@/state/question";
  import { quizState } from "@/state/quiz";
</script>

<div
  class={[
    "top-0 left-0 w-full h-20",
    $quizState.isStart
      ? $questionState.level === "easy"
        ? "bg-green-200"
        : $questionState.level === "medium"
          ? "bg-yellow-200"
          : $questionState.level === "hard"
            ? "bg-red-200"
            : $quizState.isComplete
              ? "bg-dodger-blue-200"
              : "bg-white"
      : "bg-white",
  ]}
>
  <div class="flex flex-col items-center justify-center h-full px-8">
    <h1 class="text-4xl text-gray-800 font-bold">BrainBuzz</h1>
    <h6 class="text-xl text-gray-600">Test your knowledge!</h6>
  </div>
</div>
