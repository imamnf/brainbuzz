<script lang="ts">
  import type { Question, Response } from "@/types/quiz.types";
  import { questionState } from "@/state/question";
  import { quizState } from "@/state/quiz";

  import { onMount } from "svelte";
  import { env } from "../constants";
  import { screen } from "@/state/layout";

  // State
  let questions = $state<Question[]>([]);
  let questionIndex = $state(0);
  let selectedAnswer = $state<string | null>(null);
  let shuffledAnswers = $state<string[]>([]);
  let isLoading = $state(true);

  // Utils
  function shuffleArray<T>(array: T[]): T[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function setCurrentQuestion() {
    selectedAnswer = null;
    const current = questions[questionIndex];

    if (current) {
      shuffledAnswers = shuffleArray([
        ...current.incorrect_answers,
        current.correct_answer,
      ]);
      startTimer();
    } else {
      shuffledAnswers = [];
    }
  }

  function selectAnswer(answer: string) {
    selectedAnswer = answer;
  }

  function nextQuestion() {
    if ($questionState.timerInterval)
      clearInterval($questionState.timerInterval);

    const current = questions[questionIndex];
    if (selectedAnswer === current.correct_answer) {
      $quizState.score++;
    }

    if (questionIndex < questions.length - 1) {
      questionIndex++;
      setCurrentQuestion();
    } else {
      $quizState.isComplete = true;
      $quizState.score = $quizState.score++;
      $screen = "result";
      $questionState.level = null;
    }
  }

  function startTimer() {
    if ($questionState.timerInterval)
      clearInterval($questionState.timerInterval);

    $questionState.timer =
      $questionState.level === "easy"
        ? 30
        : $questionState.level === "medium"
          ? 20
          : 10;

    $questionState.timerInterval = setInterval(() => {
      $questionState.timer--;
      if ($questionState.timer <= 0) {
        clearInterval($questionState.timerInterval!);
        nextQuestion();
      }
    }, 1000);
  }

  // Fetch Questions on Mount
  onMount(async () => {
    isLoading = true;

    try {
      const response = await fetch(
        `${env.VITE_API_URL}?amount=10&difficulty=${$questionState.level}&encode=base64`,
      );
      const data: Response = await response.json();

      if (data.response_code !== 0 || data.results.length === 0) {
        console.error("No questions found.");
        return;
      }

      questions = data.results.map((item) => ({
        ...item,
        category: atob(item.category),
        type: atob(item.type),
        difficulty: atob(item.difficulty),
        question: atob(item.question),
        correct_answer: atob(item.correct_answer),
        incorrect_answers: item.incorrect_answers.map((ans) => atob(ans)),
      }));

      setCurrentQuestion();
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      isLoading = false;
    }
  });
</script>

<!-- LOADING -->
{#if isLoading}
  <div
    class={[
      "flex justify-center items-center min-h-[calc(100vh-4rem)] text-center h-full",
      $questionState.level === "easy"
        ? "bg-green-200"
        : $questionState.level === "medium"
          ? "bg-yellow-200"
          : "bg-red-200",
    ]}
  >
    <p class="text-2xl font-semibold text-dodger-blue-500">
      Loading questions...
    </p>
  </div>
{:else}
  <!-- Quiz Content -->
  <div
    class={[
      "flex flex-col justify-center items-center min-h-screen px-4 p-8 text-center",
      $questionState.level === "easy"
        ? "bg-green-200"
        : $questionState.level === "medium"
          ? "bg-yellow-200"
          : "bg-red-200",
    ]}
  >
    <!-- Progress & Timer -->
    <div
      class="w-full max-w-2xl flex justify-between items-center mb-6 text-sm text-dodger-blue-500"
    >
      <span>Question {questionIndex + 1} / {questions.length}</span>
      <span>Time: {$questionState.timer}s</span>
    </div>

    <!-- Question Card -->
    <div
      class="bg-white p-8 w-full max-w-2xl shadow-[-0.75rem_0.75rem_0_0_#000000] hover:shadow-[-0.5rem_0.5rem_0_0_#000000] transform transition-all duration-300"
    >
      <h2 class="text-xl font-semibold mb-12">
        {@html questions[questionIndex].question}
      </h2>

      <!-- ANSWER BUTTONS -->
      <div class="flex flex-col gap-4">
        {#each shuffledAnswers as answer}
          <button
            class={[
              "p-4 border text-lg font-semibold border-gray-100 transition text-gray-800 hover:bg-dodger-blue-100",
              selectedAnswer === answer && "bg-blue-100",
            ]}
            onclick={() => selectAnswer(answer)}
          >
            {@html answer}
          </button>
        {/each}
      </div>

      <!-- Next Button -->
      <button
        class="mt-6 w-full bg-dodger-blue-500 hover:bg-dodger-blue-400 text-white py-3 rounded disabled:opacity-50"
        onclick={nextQuestion}
        disabled={selectedAnswer === null}
      >
        Next
      </button>
    </div>
  </div>
{/if}
