<script lang="ts">
  import Header from "./lib/app/Header.svelte";
  import Quiz from "./lib/Quiz.svelte";
  import Welcome from "./lib/Welcome.svelte";
  import Result from "./lib/Result.svelte";
  import { screen } from "./state/layout";

  let score = $state(0);
  let total = $state(0);
</script>

<Header />

{#if $screen === "welcome"}
  <Welcome />
{/if}

{#if $screen === "quiz"}
  <Quiz />
{/if}

{#if $screen === "result"}
  <Result />
{/if}
