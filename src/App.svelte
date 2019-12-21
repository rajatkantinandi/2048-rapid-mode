<script>
  import Cells, { directions } from "./helpers/cells";
  import SwipeHelper from "./helpers/swipeHelper";
  import Cell from "./components/Cell.svelte";
  import Button from "./components/Button.svelte";
  import AlertBox from "./components/AlertBox.svelte";
  import GameModeSwitch from "./components/GameModeSwitch.svelte";
  import ScoreBoard from "./components/ScoreBoard.svelte";
  import Header from "./components/Header.svelte";
  import { onMount } from "svelte";

  let cells = Cells(4);
  let cellsToRender = cells.getCells();
  let isGameOver = cells.checkGameOver();
  let didPlayerWin = false;
  let score = parseInt(localStorage.getItem("score")) || 0;
  let topScore = parseInt(localStorage.getItem("top-score")) || 0;
  let gameMode = localStorage.getItem("gameMode") || "Rapid";
  let swipeHelper = new SwipeHelper();
  let restartWarning = null;

  onMount(() => {
    document.querySelector("main").focus();
  });

  const restart = () => {
    cells = Cells(4, true);
    cellsToRender = cells.getCells();
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
    const didMoveOrMerge = cells.moveCells(direction, gameMode);

    if (didMoveOrMerge) {
      cells.generate();
      updateCells();
      handleScoreUpdate(cells.getScoreUpdate());
      if (cells.checkPlayerWin()) didPlayerWin = true;
    }

    if (cells.checkGameOver()) isGameOver = true;
  }

  function handleScoreUpdate(scoreUpdate) {
    score += scoreUpdate;
    localStorage.setItem("score", score);

    if (score > topScore) {
      topScore = score;
      localStorage.setItem("top-score", score);
    }
  }

  function updateCells() {
    cellsToRender = cells.getCells();
  }

  const continueGame = () => {
    didPlayerWin = false;
    document.querySelector("main").focus();
  };

  const setGameMode = mode => {
    restartWarning = {
      message:
        "Changing game mode will reset your progress.<br/>Are you sure you want to continue?",
      action: () => {
        changeGameModeNRestart(mode);
        restartWarning = null;
      }
    };
  };

  const changeGameModeNRestart = mode => {
    gameMode = mode;
    localStorage.setItem("gameMode", mode);
    restart();
  };

  const confirmRestart = () => {
    restartWarning = {
      message:
        "This will reset your progress.<br/>Are you sure you want to continue?",
      action: () => {
        restart();
        restartWarning = null;
      }
    };
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
      <Button type="continue" onClick={confirmRestart} text="New Game" />
    </div>
    <main
      on:keydown={handleKeyDown}
      tabindex="0"
      class="board"
      on:touchstart={ev => swipeHelper.handleTouchStart(ev)}
      on:touchend={handleTouchEnd}>
      {#each cellsToRender as row}
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
  {#if restartWarning}
    <AlertBox
      message={restartWarning.message}
      okAction={restartWarning.action}
      okText="Yes"
      cancelText="No"
      cancelAction={() => (restartWarning = null)} />
  {/if}
</div>
