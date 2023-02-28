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
  for (let i = 0; i < size * size; i++) {
    let square = document.createElement("div");
    square.style.backgroundColor = "rgb(255,255,255)";
    square.setAttribute("id", "white");
    square.addEventListener("mouseover", drawBoard);
    square.addEventListener("mousedown", drawBoard);
    square.addEventListener("click", function () {
      colorFill(gridItemsArray);
      //uptating the matrix on every click
      updateMatrix();
    });
    board.appendChild(square);
  }
  currentSize = size;
};
boardSize(16);

let updateBoard = (size) => {
  clearBoard();
  boardSize(size);
  visitedNeighbours = [];
};

function clearBoard() {
  board.innerHTML = "";
}

currentSliderValue.oninput = function () {
  showSliderValue.innerHTML =
    currentSliderValue.value + " x " + currentSliderValue.value;
  updateBoard(currentSliderValue.value);
};

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
  }
}

let gridItems = board.children;
let gridItemsArray = Array.from(gridItems);
let gridItemId = 0;
let visitedNeighbours = [];
let neighbourIndex = [];

let colorFill = (array) => {
  if (array.includes(getItem)) {
    isBordered(array.indexOf(getItem));
    checkVisited(array.indexOf(getItem));
    console.log("test1");
  }
  for (let i = 0; i < neighbourIndex.length; i++) {
    if (array.includes(visitedNeighbours[i])) {
      isBordered(array.indexOf(visitedNeighbours[i]));
      checkVisited(array.indexOf(visitedNeighbours[i]));
    }
  }
};

let checkVisited = (index, item) => {
  if (neighbourIndex.includes(index)) {
    console.log("already there");
  } else {
    neighbourIndex.push(index);
    visitedNeighbours.push(item);
  }
};

let isBordered = (index) => {
  let auxIndex = 0;
  let auxItem = 0;

  if (gridItemsArray[index] && gridItemsArray[index]) {
    console.log("item is defined");
  } else console.log("item is not defined");
  if (
    gridItemsArray[index].style.backgroundColor ===
      gridItemsArray[index - currentSize].style.backgroundColor &&
    (gridItemsArray[index] !== undefined ||
      gridItemsArray[index - currentSize] !== undefined)
  ) {
    console.log("not the same color " + gridItemsArray[index - currentSize]);
    auxItem = gridItemsArray[index - currentSize];
    auxIndex = index - currentSize;
    checkVisited(auxIndex, auxItem);
  }
  if (
    gridItemsArray[index].style.backgroundColor ===
      gridItemsArray[index - (currentSize - 1)].style.backgroundColor &&
    (gridItemsArray[index] !== undefined ||
      gridItemsArray[index - (currentSize - 1)] !== undefined)
  ) {
    console.log(
      "not the same color " + gridItemsArray[index - (currentSize - 1)]
    );
    auxItem = gridItemsArray[index - (currentSize - 1)];
    auxIndex = index - currentSize - 1;
    checkVisited(auxIndex, auxItem);
  }
  if (
    gridItemsArray[index].style.backgroundColor ===
      gridItemsArray[index - (currentSize + 1)].style.backgroundColor &&
    (gridItemsArray[index] !== undefined ||
      gridItemsArray[index - (currentSize + 1)])
  ) {
    console.log(
      "not the same color " + gridItemsArray[index - (currentSize + 1)]
    );
    auxItem = gridItemsArray[index - (currentSize + 1)];
    auxIndex = index - currentSize + 1;
    checkVisited(auxIndex, auxItem);
  }
  if (
    gridItemsArray[index].style.backgroundColor ===
      gridItemsArray[index - 1].style.backgroundColor &&
    (gridItemsArray[index] !== undefined ||
      gridItemsArray[index - 1] !== undefined)
  ) {
    console.log("not the same color " + gridItemsArray[index - 1]);
    auxItem = gridItemsArray[index - 1];
    auxIndex = index - 1;
    checkVisited(auxIndex, auxItem);
  }
  if (
    gridItemsArray[index].style.backgroundColor ===
      gridItemsArray[index + 1].style.backgroundColor &&
    (gridItemsArray[index] !== undefined ||
      gridItemsArray[index + 1] !== undefined)
  ) {
    console.log("not the same color " + gridItemsArray[index + 1]);
    auxItem = gridItemsArray[index + 1];
    auxIndex = index + 1;
    checkVisited(auxIndex, auxItem);
  }
  if (
    gridItemsArray[index].style.backgroundColor ===
      gridItemsArray[index + (currentSize - 1)].style.backgroundColor &&
    (gridItemsArray[index] !== undefined ||
      gridItemsArray[index + (currentSize - 1)] !== undefined)
  ) {
    console.log(
      "not the same color " + gridItemsArray[index + (currentSize - 1)]
    );
    auxItem = gridItemsArray[index + (currentSize - 1)];
    auxIndex = index + currentSize - 1;
    checkVisited(auxIndex, auxItem);
  }
  if (
    gridItemsArray[index].style.backgroundColor ===
      gridItemsArray[index + currentSize].style.backgroundColor &&
    (gridItemsArray[index] !== undefined ||
      gridItemsArray[index + currentSize] !== undefined)
  ) {
    console.log("not the same color " + gridItemsArray[index + currentSize]);
    auxItem = gridItemsArray[index + currentSize];
    auxIndex = index + currentSize;
    checkVisited(auxIndex, auxItem);
  }
  if (
    gridItemsArray[index].style.backgroundColor ===
      gridItemsArray[index + (currentSize + 1)].style.backgroundColor &&
    (gridItemsArray[index] !== undefined ||
      gridItemsArray[index + (currentSize + 1)] !== undefined)
  ) {
    console.log(
      "not the same color " + gridItemsArray[index + (currentSize + 1)]
    );
    auxItem = gridItemsArray[index + (currentSize + 1)];
    auxIndex = index + currentSize + 1;
    checkVisited(auxIndex, auxItem);
  }
};

let updateMatrix = () => {
  gridItems = board.children;
  gridItemsArray = Array.from(gridItems);
  // gridItemsArray2D = toMatrix(gridItemsArray, currentSize);
};

//convert array into matrix representing the game board/grid
// let toMatrix = (arr, width) => {
//   return arr.reduce(function (rows, key, index) {
//     return (
//       (index % width == 0
//         ? rows.push([key])
//         : rows[rows.length - 1].push(key)) && rows
//     );
//   }, []);
// };

// let gridItemsArray2D = toMatrix(gridItemsArray, currentSize);

window.onload = boardSize(DEFAULT_SIZE);
