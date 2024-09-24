<script>
  import Button from "./Button.svelte";

  export let title = "";
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
    padding: 0 20px;
  }

  .fancyAlertBox {
    background: linear-gradient(45deg, #133, rgba(0, 0, 0, 0.4), #133),
      linear-gradient(-45deg, #133, rgba(0, 0, 0, 0.4), #133);
    text-align: center;
  }

  @keyframes appear {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .title {
    font-family: "Pacifico", cursive;
    font-size: 24px;
    margin-bottom: 15px;
    line-height: 30px;
  }

  .message {
    margin: 0 15px 20px 15px;
    overflow-y: auto;
    max-height: 80%;
    max-width: 600px;
    font-size: 18px;
  }
</style>

<div class={'alertbox' + (notFancy ? '' : ' fancyAlertBox')}>
  {#if title}
    <div class="title">
      {title}
    </div>
  {/if}
  {#if message}
    <div class="message">
      {@html message}
    </div>
  {/if}
  <div class="buttons">
    {#if cancelText}
      <Button type="cancel" text={cancelText} onClick={cancelAction} />
    {/if}
    {#if okText}
      <Button type="continue" text={okText} onClick={okAction} />
    {/if}
  </div>
</div>
