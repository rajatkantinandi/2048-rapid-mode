<script>
  import { initCells, createNewCell } from "./helpers/gererator";
  import { moveCells, directions, checkGameOver } from "./helpers/cell";
  import Cell from "./Cell.svelte";
  import NewGameBtn from "./NewGame.svelte";
  import AlertBox from "./AlertBox.svelte";
  import GameModeSwitch from "./GameModeSwitch.svelte";
  import ScoreBoard from './ScoreBoard.svelte';

  let cells = JSON.parse(localStorage.getItem("cells")) || initCells(4);
  let isGameOver = checkGameOver(cells);
  let didPlayerWin = false;
  let score = parseInt(localStorage.getItem("score")) || 0;
  let topScore = parseInt(localStorage.getItem("top-score")) || 0;
  let gameMode = localStorage.getItem("gameMode") || "Rapid";

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
      const moveCellsData = moveCells(ev.key, cells, gameMode);
      const freshCells = moveCellsData.didMoveOrMerge
        ? createNewCell(moveCellsData.cells)
        : null;

      if (freshCells) {
        updateCells(freshCells);
        handleScoreUpdate(moveCellsData.scoreUpdate);
        if (moveCellsData.didPlayerWin) didPlayerWin = true;
      }

      if (checkGameOver(cells)) isGameOver = true;
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
  };

  const setGameMode = mode => {
    gameMode = mode;
    localStorage.setItem("gameMode", mode);
  };
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Audiowide|Comfortaa|Pacifico&display=swap");

  body {
    font-family: "Comfortaa", sans-serif;
  }

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
    <GameModeSwitch {gameMode} {setGameMode} />
    <div class="scoring">
      <ScoreBoard {score}/>
      <ScoreBoard {topScore}/>
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
