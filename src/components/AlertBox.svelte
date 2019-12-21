<script>
  import Button from "./Button.svelte";

  export let message = "";
  export let okAction = () => {};
  export let okText = "Play Again";
  export let cancelText = null;
  export let cancelAction = () => {};
</script>

<style>
  .alertbox {
    background: linear-gradient(45deg, #133, rgba(0, 0, 0, 0.4), #133),
      linear-gradient(-45deg, #133, rgba(0, 0, 0, 0.4), #133);
    color: white;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    font-size: 35px;
    text-align: center;
    animation: appear 0.5s ease-out;
    font-family: "Pacifico", cursive;
  }

  @keyframes appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .message {
    margin-bottom: 20px;
  }
</style>

<div class="alertbox">
  <div class="message">{@html message}</div>
  <div class="buttons">
    {#if cancelText}
      <Button type="cancel" text={cancelText} onClick={cancelAction} />
    {/if}
    <Button type="continue" text={okText} onClick={okAction} />
  </div>
</div>
