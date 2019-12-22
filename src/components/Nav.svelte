<script>
  import Button from "./Button.svelte";
  export let gameMode;
  export let setGameMode;
  export let showInstructions;

  function handleModeChange(ev) {
    setGameMode(ev.target.innerText);
  }
</script>

<style>
  .mode-toggle {
    border-radius: 0 10px 10px 0;
    padding: 5px 20px;
    font-size: 1em;
    background: grey;
    color: white;
    border: none;
    cursor: pointer;
    opacity: 0.8;
    margin: 0;
    transition: 0.2s ease-out;
  }

  .mode-toggle:hover,
  .mode-toggle:focus {
    opacity: 1;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.5);
  }

  .mode-toggle:nth-child(1) {
    border-radius: 10px 0 0 10px;
    margin-left: 10px;
  }

  .mode-toggle:nth-child(2) {
    margin-right: 20px;
  }

  .selected {
    background: #11cc00;
  }

  nav {
    margin: 0.5em;
    font-size: 1.4em;
    display: flex;
    align-items: center;
  }
</style>

<nav>
  Mode:
  <button
    class={'mode-toggle' + (gameMode === 'Rapid' ? ' selected' : '')}
    id="rapid-mode"
    on:click={handleModeChange}>
    Rapid
  </button>
  <button
    class={'mode-toggle' + (gameMode === 'Normal' ? ' selected' : '')}
    id="normal-mode"
    on:click={handleModeChange}>
    Normal
  </button>
  <Button type="help" text="How to Play" onClick={showInstructions} />
</nav>
