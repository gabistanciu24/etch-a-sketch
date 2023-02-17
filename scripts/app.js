const board = document.querySelector(".board");
const showSliderValue = document.getElementById("size-val");
const currentSliderValue = document.getElementById("slider-size");

currentSliderValue.value = 16;
//continuously update the value while the slider is clicked and held
currentSliderValue.addEventListener("mousedown", function (e) {
  currentSliderValue.addEventListener("mousemove", updateSliderValue);
  clearBoard();
});

//update the slider value in paragraph
function updateSliderValue(e) {
  showSliderValue.innerHTML =
    currentSliderValue.value + " x " + currentSliderValue.value;
  updateBoard(currentSliderValue.value);
}

//stops updating the value once the mouse is released
currentSliderValue.addEventListener("mouseup", function (e) {
  showSliderValue.removeEventListener("mousemove", updateSliderValue);
});

let boardSize = (size) => {
  board.style.gridTemplateColumns = "repeat(" + size + ",1fr)";
  board.style.gridTemplateRows = "repeat(" + size + ",1fr)";

  for (let i = 0; i < size * size; i++) {
    let square = document.createElement("div");
    square.style.backgroundColor = "blue";
    board.appendChild(square);
  }
};

let updateBoard = (size) => {
  clearBoard();
  boardSize(size);
};

function clearBoard() {
  board.innerHTML = "";
}
