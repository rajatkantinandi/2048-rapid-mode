<script>
  export let onClick;
  export let text = "New Game";
  export let type = "continue";
</script>

<style>
  button {
    border: 1px solid #abc;
    border-radius: 20px;
    padding: 10px 20px;
    color: white;
    font-size: 18px;
    cursor: pointer;
    transition: 0.2s ease-out;
    white-space: nowrap;
  }

  .continue {
    background: rgb(218, 48, 36);
  }

  .continue:hover {
    background: maroon;
    box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.25);
  }

  .cancel {
    background: rgb(200,200,200);
    color: #113;
  }

  .cancel:hover {
    background: #abc;
    box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.25);
  }

  .help {
    background: rgb(28, 48, 216);
  }

  .help:hover {
    background: indigo;
    box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.25);
  }
</style>

<button class={type} id="newgame" on:click={onClick}>{text}</button>
