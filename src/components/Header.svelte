<script>
  import Cell from "./Cell.svelte";
</script>

<header>
  <h1>
    <Cell value="2" small />
    <Cell value="0" small />
    <Cell value="4" small />
    <Cell value="8" small />
  </h1>
</header>

<style>
  h1 {
    display: flex;
    flex-direction: row;
    margin: 5px;
    height: 60px;
  }

  @media (max-width: 500px) {
    h1 {
      margin-bottom: 10px;
      font-size: 26px;
    }
  }

  @media (max-width: 400px) {
    h1 {
      margin-bottom: 10px;
      font-size: 24px;
    }
  }

  @media (max-width: 330px) {
    h1 {
      margin-bottom: 10px;
      font-size: 20px;
    }
  }
</style>
