<script>
  import Button from "./Button.svelte";

  export let message = "";
  export let okAction = () => null;
  export let okText = null;
  export let cancelText = null;
  export let cancelAction = () => {};
  export let notFancy = false;
</script>

<style>
  .alertbox {
    background: rgba(0,20,0,0.9);
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: absolute;
    animation: appear 0.5s ease-out;
    font-size: 20px;
    color: white;
  }

  .fancyAlertBox {
    background: linear-gradient(45deg, #133, rgba(0, 0, 0, 0.4), #133),
      linear-gradient(-45deg, #133, rgba(0, 0, 0, 0.4), #133);
    font-family: "Pacifico", cursive;
    text-align: center;
    font-size: 35px;
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
    margin: 0 15px 20px 15px;
    overflow: auto;
    max-height: 70%;
    max-width: 600px;
  }
</style>

<div class={'alertbox' + (notFancy ? '' : ' fancyAlertBox')}>
  <div class="message">
    {@html message}
  </div>
  <div class="buttons">
    {#if cancelText}
      <Button type="cancel" text={cancelText} onClick={cancelAction} />
    {/if}
    {#if okText}
      <Button type="continue" text={okText} onClick={okAction} />
    {/if}
  </div>
</div>
