<script lang="ts">
  import type { Difficulty } from "@/types/index.types";
  import type { Question, Response } from "@/types/quiz.types";

  import { onMount } from "svelte";
  import { env } from "../constants";

  // Types
  interface QuizProps {
    difficulty: Difficulty | null;
    setComplete: (score: number, total: number) => void;
  }
  let { difficulty, setComplete }: QuizProps = $props();

  // State
  let questions = $state<Question[]>([]);
  let questionIndex = $state(0);
  let selectedAnswer = $state<string | null>(null);
  let shuffledAnswers = $state<string[]>([]);
  let score = $state(0);
  let timer = $state(0);
  let timerInterval = $state<ReturnType<typeof setInterval> | null>(null);
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
    if (timerInterval) clearInterval(timerInterval);

    const current = questions[questionIndex];
    if (selectedAnswer === current.correct_answer) {
      score++;
    }

    if (questionIndex < questions.length - 1) {
      questionIndex++;
      setCurrentQuestion();
    } else {
      setComplete(score, questions.length);
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);

    timer = difficulty === "easy" ? 30 : difficulty === "medium" ? 20 : 10;

    timerInterval = setInterval(() => {
      timer--;
      if (timer <= 0) {
        clearInterval(timerInterval!);
        nextQuestion();
      }
    }, 1000);
  }

  // Fetch Questions on Mount
  onMount(async () => {
    isLoading = true;

    try {
      const response = await fetch(
        `${env.VITE_API_URL}?amount=10&difficulty=${difficulty}&encode=base64`,
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
      "flex justify-center items-center min-h-screen text-center",
      difficulty === "easy"
        ? "bg-green-200"
        : difficulty === "medium"
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
      "flex flex-col justify-center items-center min-h-screen px-4 text-center",
      difficulty === "easy"
        ? "bg-green-200"
        : difficulty === "medium"
          ? "bg-yellow-200"
          : "bg-red-200",
    ]}
  >
    <!-- Progress & Timer -->
    <div
      class="w-full max-w-2xl flex justify-between items-center mb-6 text-sm text-dodger-blue-500"
    >
      <span>Question {questionIndex + 1} / {questions.length}</span>
      <span>Time: {timer}s</span>
    </div>

    <!-- Question Card -->
    <div
      class="bg-white p-8 w-full max-w-2xl shadow-[1rem_1.25rem_0_0_#000000] hover:shadow-[0.75rem_1rem_0_0_#000000] transform transition-all duration-300"
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
