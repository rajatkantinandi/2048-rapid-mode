<script>
  import Cell from "./Cell.svelte";
</script>

<style>
  h1 {
    display: flex;
    flex-direction: row;
    margin: 5px;
    height: 60px;
  }
</style>

<header>
  <h1>
    <Cell value="2" small />
    <Cell value="0" small />
    <Cell value="4" small />
    <Cell value="8" small />
  </h1>
</header>
