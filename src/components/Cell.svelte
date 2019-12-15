<script>
  export let value;
  export let small = false;
  const classMaps = {
    0: "zero",
    2: "two",
    4: "four",
    8: "eight",
    16: "sixteen",
    32: "thirtyTwo",
    64: "sixtyFour",
    128: "oneTwentyEight",
    256: "twoFiveSix",
    512: "fiveOneTwo",
    1024: "one024",
    2048: "two048",
    4096: "four096",
    8192: "eight192",
    16384: "one6384",
    32768: "three2768",
    65536: "six5536"
  };
</script>

<style>
  .cell {
    width: 100px;
    height: 100px;
    margin: 5px;
    text-align: center;
    background: #fbe9e7;
    border: 1px solid #3e2723;
    border-radius: 15px;
    font-size: 45px;
    line-height: 100px;
    box-shadow: 0px 0px 10px -2px black;
    box-sizing: border-box;
    animation: pop 0.3s ease-out;
    font-family: "Audiowide", sans-serif;
    opacity: 0.9;
    user-select: none;
  }

  @keyframes pop {
    0% {
      transform: scale(0.4);
    }
    70% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .emptycell {
    width: 100px;
    height: 100px;
    margin: 5px;
    background: darkgrey;
    border-radius: 15px;
  }

  .zero {
    background: radial-gradient(#99aae7, #99ccf9);
  }

  .two {
    background: radial-gradient(#fbd7d7, #fcf8f8);
  }

  .four {
    background: radial-gradient(#fbb797, #fcc8b1);
  }

  .eight {
    background: radial-gradient(#fb9797, #fba7a7);
  }

  .sixteen {
    background: radial-gradient(#fb6957, #fb8767);
    color: #fbe9e7;
  }

  .thirtyTwo {
    background: radial-gradient(#fb2727, #fb4036);
    color: #fbe9e7;
  }

  .sixtyFour {
    background: radial-gradient(#aa1111, #ba3333);
    color: white;
  }

  .oneTwentyEight {
    background: radial-gradient(yellow, rgb(243, 243, 110));
    font-size: 35px;
  }

  .twoFiveSix {
    background: radial-gradient(orange, rgb(243, 187, 83));
    font-size: 35px;
    color: white;
  }

  .fiveOneTwo {
    background: radial-gradient(rgb(190, 106, 50), rgb(223, 137, 79));
    font-size: 35px;
    color: white;
  }

  .one024 {
    background: radial-gradient(rgb(175, 231, 19), rgb(193, 247, 45));
    font-size: 28px;
  }

  .two048 {
    background: radial-gradient(green, rgb(11, 204, 11));
    font-size: 25px;
    color: #fbe9e7;
  }

  .four096 {
    background: radial-gradient(indigo, rgb(107, 8, 177));
    font-size: 25px;
    color: #fbe9e7;
  }

  .eight192 {
    background: radial-gradient(#4444cc, #4466ee);
    font-size: 28px;
    color: #fbe9e7;
  }

  .one6384 {
    background: radial-gradient(#04a4aa, #44c699);
    font-size: 23px;
    color: white;
  }

  .three2768 {
    background: radial-gradient(green, #a4c622 150%);
    font-size: 23px;
    color: white;
  }

  .six5536 {
    background: radial-gradient(purple, hotpink 200%);
    font-size: 23px;
    color: white;
  }

  .cell.small {
    width: 50px;
    height: 50px;
    line-height: 50px;
    font-size: 25px;
  }
</style>

<div
  class={(value ? 'cell ' + classMaps[value] : 'emptycell') + (small ? ' small' : '')}>
  {value || ''}
</div>
