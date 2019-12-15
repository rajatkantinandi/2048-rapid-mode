<script>
  import { initCells, createNewCell } from "./helpers/gererator";
  import { moveCells, directions, checkGameOver } from "./helpers/cell";
  import SwipeHelper from "./helpers/swipeHelper";
  import Cell from "./components/Cell.svelte";
  import NewGameBtn from "./components/NewGame.svelte";
  import AlertBox from "./components/AlertBox.svelte";
  import GameModeSwitch from "./components/GameModeSwitch.svelte";
  import ScoreBoard from "./components/ScoreBoard.svelte";
  import Header from "./components/Header.svelte";
  import { onMount } from 'svelte';

  let cells = JSON.parse(localStorage.getItem("cells")) || initCells(4);
  let isGameOver = checkGameOver(cells);
  let didPlayerWin = false;
  let score = parseInt(localStorage.getItem("score")) || 0;
  let topScore = parseInt(localStorage.getItem("top-score")) || 0;
  let gameMode = localStorage.getItem("gameMode") || "Rapid";
  let swipeHelper = new SwipeHelper();

  onMount(() => {
    document.querySelector("main").focus();
  });

  const restart = () => {
    cells = initCells(4);
    isGameOver = false;
    handleScoreUpdate(-score);
    document.querySelector("main").focus();
  };

  function handleKeyDown(ev) {
    if (ev.altKey && ev.which === 78) {
      restart();
    } else if (Object.values(directions).indexOf(ev.key) >= 0) {
      play(ev.key);
    }
  }

  function play(direction) {
    const moveCellsData = moveCells(direction, cells, gameMode);
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
    document.querySelector("main").focus();
  };

  const setGameMode = mode => {
    gameMode = mode;
    localStorage.setItem("gameMode", mode);
    document.querySelector("main").focus();
  };

  function handleTouchEnd(ev) {
    ev.preventDefault();
    const direction = swipeHelper.handleTouchEnd(ev);
    play(direction);
  }
</script>

<style>
  @import url("https://fonts.googleapis.com/css?family=Audiowide|Comfortaa|Pacifico&display=swap");

  button {
    cursor: pointer;
  }

  .game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: "Comfortaa", sans-serif;
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    transform-origin: 50% 10%;
  }

  main {
    outline: none;
  }

  .scoring {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
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
      transform: scale(0.72);
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

<div>
  <div class="game">
    <Header />
    <GameModeSwitch {gameMode} {setGameMode} />
    <div class="scoring">
      <ScoreBoard {score} />
      <ScoreBoard {topScore} />
      <NewGameBtn onClick={restart} />
    </div>
    <main
      on:keydown={handleKeyDown}
      tabindex="0"
      class="board"
      on:touchstart={ev => swipeHelper.handleTouchStart(ev)}
      on:touchend={handleTouchEnd}>
      {#each cells as row}
        {#each row as cell}
          <Cell value={cell} />
        {/each}
      {/each}
    </main>
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
</div>
