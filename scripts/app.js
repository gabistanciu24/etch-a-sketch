const board = document.querySelector(".board");
const sliderValue = document.getElementById("size-val");

let boardSize = (size) => {
  board.style.gridTemplateColumns = "repeat(${size},1fr)";
  board.style.gridTemplateRows = "repeat(${size},1fr)";

  for (let i = 0; i < 16 * 16; i++) {
    let square = document.createElement("div");
    square.style.backgroundColor = "blue";
    board.appendChild(square);
  }
};
