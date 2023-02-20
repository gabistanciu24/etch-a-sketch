const DEFAULT_SIZE = 16;
const DEFAULT_MODE = "color";

const board = document.querySelector(".board");
const showSliderValue = document.getElementById("size-val");
const currentSliderValue = document.getElementById("slider-size");
const colorButton = document.getElementById("color-btn");
const rainbowButton = document.getElementById("rainbow-btn");
const eraserButton = document.getElementById("erase-btn");
const clearButton = document.getElementById("clear-btn");

let colorValue = document.getElementById("color-picker");
let currentMode = DEFAULT_MODE;
let currentSize = 0;

let clickedColorButton = () => {
  colorButton.classList.add("active-btn");
  currentMode = DEFAULT_MODE;
  changeMode(currentMode);
};

let clickedRainbowButton = () => {
  rainbowButton.classList.add("active-btn");
  currentMode = "rainbow";
  changeMode(currentMode);
};

let clickedEraserButton = () => {
  eraserButton.classList.add("active-btn");
  currentMode = "eraser";
  changeMode(currentMode);
};

let clickedClearButton = () => {
  updateBoard(currentSize);
};

colorButton.addEventListener("click", clickedColorButton);
rainbowButton.addEventListener("click", clickedRainbowButton);
eraserButton.addEventListener("click", clickedEraserButton);
clearButton.addEventListener("click", clickedClearButton);

let isDrawing = false;
document.body.onmousedown = () => (isDrawing = true);
document.body.onmouseup = () => (isDrawing = false);

let boardSize = (size) => {
  board.style.gridTemplateColumns = "repeat(" + size + ",1fr)";
  board.style.gridTemplateRows = "repeat(" + size + ",1fr)";
  currentSize = size;
  for (let i = 0; i < size * size; i++) {
    let square = document.createElement("div");
    square.style.backgroundColor = "white";
    square.addEventListener("mouseover", drawBoard);
    square.addEventListener("mousedown", drawBoard);
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

function changeMode(mode) {
  if (mode === "rainbow") {
    colorButton.classList.remove("active-btn");
    eraserButton.classList.remove("active-btn");
  } else if (mode === "color") {
    eraserButton.classList.remove("active-btn");
    rainbowButton.classList.remove("active-btn");
  } else if (mode === "eraser") {
    colorButton.classList.remove("active-btn");
    rainbowButton.classList.remove("active-btn");
  }
}

function drawBoard(e) {
  if (e.type === "mouseover" && !isDrawing) return;
  if (currentMode === "color") {
    e.target.style.backgroundColor = colorValue.value;
  } else if (currentMode === "rainbow") {
    const rgbR = Math.floor(Math.random() * 256);
    const rgbG = Math.floor(Math.random() * 256);
    const rgbB = Math.floor(Math.random() * 256);
    e.target.style.backgroundColor =
      "rgb(" + rgbR + "," + rgbG + "," + rgbB + ")";
  } else if (currentMode === "eraser") {
    e.target.style.backgroundColor = "white";
  }
}

window.onload = () => {
  boardSize(DEFAULT_SIZE);
};
