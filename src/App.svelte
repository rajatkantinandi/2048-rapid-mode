<script>
  import { initCells, createNewCell } from "./helpers/gererator";
  import Cell from "./Cell.svelte";
  import NewGameBtn from "./NewGame.svelte";
  import AlertBox from "./AlertBox.svelte";
  import { moveCells } from "./helpers/cell";

  let cells = JSON.parse(localStorage.getItem("cells")) || initCells(4);
  let isGameOver = false;
  let didPlayerWin = false;

  const restart = () => {
    cells = initCells(4);
    isGameOver = false;
  };

  function action(ev) {
    if (ev.altKey && ev.which === 78) {
      restart();
    } else {
      const freshCells = createNewCell(moveCells(ev.key, cells));

      if (freshCells) cells = freshCells;
      else isGameOver = true;
    }
  }

  const continueGame = () => (didPlayerWin = false);
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Audiowide&display=swap");

  button {
    cursor: pointer;
  }

  .game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .scoring {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

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
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 0 15px;
  }
  h1 {
    display: flex;
    flex-direction: row;
    margin: 5px;
    height: 60px;
  }

  h1 .cell {
    margin: 1px;
    position: relative;
    font-size: 35px;
    height: 48px;
    width: 60px;
    padding-top: 6px;
  }

  .board {
    width: 450px;
    height: 450px;
    padding: 10px;
    border: 15px solid black;
    background: grey;
    border-radius: 20px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
  }

  .mode-toggle {
    border-radius: 10px;
    padding: 5px 20px;
    font-size: 1em;
    background: grey;
    color: darkgray;
  }

  .btn-selected {
    background: #4444cc;
    color: white;
  }

  @media (max-width: 500px) {
    .game {
      transform: scale(0.85);
    }
    h1 {
      margin-bottom: 10px;
      font-size: 26px;
    }
  }

  @media (max-width: 400px) {
    .game {
      transform: scale(0.7);
    }
    h1 {
      margin-bottom: 10px;
      font-size: 24px;
    }
  }

  @media (max-width: 330px) {
    .game {
      transform: scale(0.6);
    }
    h1 {
      margin-bottom: 10px;
      font-size: 20px;
    }
  }
</style>

<main on:keydown={action} tabindex="0" autofocus>
  <div class="game">
    <h1>
      <Cell value="2" small />
      <Cell value="0" small />
      <Cell value="4" small />
      <Cell value="8" small />
    </h1>
    <h3>
      Mode:
      <button class="btn-selected mode-toggle" id="rapid-mode">Rapid</button>
      <button class="mode-toggle" id="normal-mode">Normal</button>
    </h3>
    <div class="scoring">
      <div class="scoreboard">
        Score
        <div class="score">0</div>
      </div>
      <div class="scoreboard">
        Top Score
        <div class="score">0</div>
      </div>
      <NewGameBtn onClick={restart} />
    </div>
    <hr />
    <div class="board">
      {#each cells as row}
        {#each row as cell}
          <Cell value={cell} />
        {/each}
      {/each}
    </div>
  </div>
  {#if isGameOver}
    <AlertBox message="Game Over" okAction={restart} />
  {/if}
  {#if didPlayerWin}
    <AlertBox
      message="Congrats!! You have won!"
      okAction={continueGame}
      okText="Continue" />
  {/if}
</main>
