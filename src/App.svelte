<script>
  import { initCells, createNewCell } from "./helpers/gererator";
  import Cell from "./Cell.svelte";
  import NewGameBtn from "./NewGame.svelte";
  import AlertBox from "./AlertBox.svelte";
  import { moveCells, directions } from "./helpers/cell";

  let cells = JSON.parse(localStorage.getItem("cells")) || initCells(4);
  let isGameOver = false;
  let didPlayerWin = false;
  let score = parseInt(localStorage.getItem("score")) || 0;
  let topScore = parseInt(localStorage.getItem("top-score")) || 0;

  const restart = () => {
    cells = initCells(4);
    isGameOver = false;
    handleScoreUpdate(-score);
    document.body.focus();
  };

  function action(ev) {
    if (ev.altKey && ev.which === 78) {
      restart();
    } else if (Object.values(directions).indexOf(ev.key) >= 0) {
      const moveCellsData = moveCells(ev.key, cells);
      const freshCells = createNewCell(moveCellsData.cells);

      if (moveCellsData.didPlayerWin) didPlayerWin = true;

      handleScoreUpdate(moveCellsData.scoreUpdate);

      if (freshCells) updateCells(freshCells);
      else isGameOver = true;
    }
  }

  function handleScoreUpdate(scoreUpdate) {
    score += scoreUpdate;
    localStorage.setItem("score", score);

    if (score > topScore) {
      topScore = score;
      localStorage.setItem("top-score", score);
    }
  }

  function updateCells(freshCells) {
    cells = freshCells;
    localStorage.setItem("cells", JSON.stringify(freshCells));
  }

  const continueGame = () => {
    didPlayerWin = false;
    document.body.focus();
  }
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

<body on:keydown={action} tabindex="0" autofocus>
  <div class="game">
    <h1>
      <Cell value="2" small />
      <Cell value="0" small />
      <Cell value="4" small />
      <Cell value="8" small />
    </h1>
    <h3>
      Mode:
      <button class="mode-toggle" id="rapid-mode">Rapid</button>
      <button class="btn-selected mode-toggle" id="normal-mode">Normal</button>
    </h3>
    <div class="scoring">
      <div class="scoreboard">
        Score
        <div class="score">{score}</div>
      </div>
      <div class="scoreboard">
        Top Score
        <div class="score">{topScore}</div>
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
</body>
