<script>
  export let score;
  export let topScore;
</script>

<style>
  .score {
    font-family: "Audiowide", monospace;
    font-size: 1.2em;
    color: honeydew;
  }

  .scoreboard {
    color: white;
    border-radius: 10px;
    text-align: center;
    margin-right: 10px;
    background: linear-gradient(to bottom, #131 30%, #011101 50%);
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 0 15px;
    white-space: nowrap;
  }
</style>

<div class="scoreboard">
  {#if score !== undefined}Score{:else}Top Score{/if}
  <div class="score">{score !== undefined ? score : topScore}</div>
</div>
