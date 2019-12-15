<script>
  export let onClick;
  export let text = "New Game";
</script>

<style>
  .continue {
    border: 1px solid #abc;
    border-radius: 20px;
    padding: 10px 25px;
    color: white;
    font-size: 18px;
    background: rgb(218, 48, 36);
    cursor: pointer;
    transition: 0.2s ease-out;
    white-space: nowrap;
  }

  .continue:hover {
    background: maroon;
    box-shadow: 1px 2px 5px 0 rgba(0, 0, 0, 0.25);
  }
</style>

<button class="continue" id="newgame" on:click={onClick}>{text}</button>
