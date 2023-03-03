const DEFAULT_SIZE = 16;
const DEFAULT_MODE = "color";

const board = document.querySelector(".board");
const showSliderValue = document.getElementById("size-val");
const currentSliderValue = document.getElementById("slider-size");
const colorButton = document.getElementById("color-btn");
const rainbowButton = document.getElementById("rainbow-btn");
const eraserButton = document.getElementById("erase-btn");
const clearButton = document.getElementById("clear-btn");
const fillButton = document.getElementById("fill-btn");

let colorValue = document.getElementById("color-picker");
let currentMode = DEFAULT_MODE;
let currentSize = 0;
let sliderPosition = 0;
let getItem = 0;

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

let clickedFillButton = () => {
  fillButton.classList.add("active-btn");
  currentMode = "fill";
  changeMode(currentMode);
};

colorButton.addEventListener("click", clickedColorButton);
rainbowButton.addEventListener("click", clickedRainbowButton);
eraserButton.addEventListener("click", clickedEraserButton);
clearButton.addEventListener("click", clickedClearButton);
fillButton.addEventListener("click", clickedFillButton);

let isDrawing = false;
document.body.onmousedown = () => (isDrawing = true);
document.body.onmouseup = () => (isDrawing = false);

let boardSize = (size) => {
  board.style.gridTemplateColumns = "repeat(" + size + ",1fr)";
  board.style.gridTemplateRows = "repeat(" + size + ",1fr)";
  for (let i = 0; i < size * size; i++) {
    let square = document.createElement("div");
    square.style.backgroundColor = "rgb(255,255,255)";
    square.setAttribute("id", "white");
    square.addEventListener("mouseover", drawBoard);
    square.addEventListener("mousedown", drawBoard);
    square.addEventListener("click", function () {
      //uptating the matrix on every click
      updateMatrix();
    });
    board.appendChild(square);
  }
  currentSize = size;
};
boardSize(16);

let gridItems = board.children;
let gridItemsArray = Array.from(gridItems);
let gridItemId = 0;

//convert array into matrix representing the game board/grid
let toMatrix = (arr, width) => {
  return arr.reduce(function (rows, key, index) {
    return (
      (index % width == 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows
    );
  }, []);
};

let updateBoard = (size) => {
  clearBoard();
  boardSize(size);
  gridItemsArray2D = toMatrix(gridItemsArray, currentSize);
};

function clearBoard() {
  board.innerHTML = "";
}

currentSliderValue.oninput = function () {
  showSliderValue.innerHTML =
    currentSliderValue.value + " x " + currentSliderValue.value;
  updateBoard(currentSliderValue.value);
  updateMatrix();
};

function changeMode(mode) {
  if (mode === "rainbow") {
    colorButton.classList.remove("active-btn");
    eraserButton.classList.remove("active-btn");
    fillButton.classList.remove("active-btn");
  } else if (mode === "color") {
    eraserButton.classList.remove("active-btn");
    rainbowButton.classList.remove("active-btn");
    fillButton.classList.remove("active-btn");
  } else if (mode === "eraser") {
    colorButton.classList.remove("active-btn");
    rainbowButton.classList.remove("active-btn");
    fillButton.classList.remove("active-btn");
  } else if (mode === "fill") {
    colorButton.classList.remove("active-btn");
    eraserButton.classList.remove("active-btn");
    rainbowButton.classList.remove("active-btn");
  }
}

function drawBoard(e) {
  if (e.type === "mouseover" && !isDrawing) return;
  if (currentMode === "color") {
    e.target.style.backgroundColor = colorValue.value;
    e.target.setAttribute("id", "color-mode");
    //get index of the clicked grid cell if color mode is active
    getItem = e.target;
    console.log(getItem);
  } else if (currentMode === "rainbow") {
    const rgbR = Math.floor(Math.random() * 256);
    const rgbG = Math.floor(Math.random() * 256);
    const rgbB = Math.floor(Math.random() * 256);
    e.target.style.backgroundColor =
      "rgb(" + rgbR + "," + rgbG + "," + rgbB + ")";
    e.target.setAttribute("id", "rainbow-mode");
    //get index of the clicked grid cell if rainbow mode is active
    getItem = e.target;
    console.log(getItem);
  } else if (currentMode === "eraser") {
    e.target.style.backgroundColor = "rgb(255,255,255)";
  }
  if (currentMode === "fill") {
    //get index of the clicked grid cell if fill mode is active
    getItem = e.target;
    console.log(getItem);
  }
}

let fillColor = (array, item) => {
  updateMatrix();
  let col;
  let row;
  for (let i = 0; i < currentSize * currentSize; i++) {
    for (let j = 0; j < currentSize * currentSize; j++) {
      if (array?.[i]?.[j] === item) {
        col = i;
        row = j;
        console.log(col + " " + row);
      }
    }
  }
  let oldColor = item.style.backgroundColor;
  let newColor = colorValue.value;
  floodFillCheck(col, row, oldColor, newColor);
};

let floodFillCheck = (i, j, oldColor, newColor) => {
  if (
    i < 0 ||
    i >= gridItemsArray2D.length ||
    j < 0 ||
    j >= gridItemsArray2D[i].length
  )
    return;
  if (gridItemsArray2D[i][j].style.backgroundColor !== oldColor) return;

  gridItemsArray2D[i][j].style.backgroundColor = newColor;

  floodFillCheck(i + 1, j, oldColor, newColor);
  floodFillCheck(i - 1, j, oldColor, newColor);
  floodFillCheck(i, j + 1, oldColor, newColor);
  floodFillCheck(i, j - 1, oldColor, newColor);
};

let updateMatrix = () => {
  gridItems = board.children;
  gridItemsArray = Array.from(gridItems);
  gridItemsArray2D = toMatrix(gridItemsArray, currentSize);
};

let gridItemsArray2D = toMatrix(gridItemsArray, currentSize);
window.onload = boardSize(DEFAULT_SIZE);
