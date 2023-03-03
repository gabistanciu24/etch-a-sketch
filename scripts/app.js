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

//checking if the mouse-click is held while drawing on the board in order to
//implement the functionality to click and hold and draw while holding the click
let isDrawing = false;
document.body.onmousedown = () => (isDrawing = true);
document.body.onmouseup = () => (isDrawing = false);

//creating the board based on the slider value and making the board square-shaped at the same time
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
      if (currentMode === "fill") {
        //when the drawing mode is fill, call the fillColor function to fill the area the user clicked in
        fillColor(gridItemsArray2D, getItem);
      }
    });
    board.appendChild(square);
  }
  currentSize = size;
};
boardSize(16);

//getting all the items from the grid in order to use them in the Flood Fill algorithm
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

//update the board and the items matrix when resizing the board
currentSliderValue.oninput = function () {
  showSliderValue.innerHTML =
    currentSliderValue.value + " x " + currentSliderValue.value;
  updateBoard(currentSliderValue.value);
  updateMatrix();
};

//changing drawing modes
//making other 'available' buttons unavailable
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
  //if the drawing mode is 'color' change background color of the selected cell to color selector's value
  if (currentMode === "color") {
    e.target.style.backgroundColor = colorValue.value;
    e.target.setAttribute("id", "color-mode");
    //get index of the clicked grid cell if color mode is active
    getItem = e.target;
    //console.log(getItem);
  } else if (currentMode === "rainbow") {
    //create random color for the selected cells when the drawing mode is set to rainbow
    const rgbR = Math.floor(Math.random() * 256);
    const rgbG = Math.floor(Math.random() * 256);
    const rgbB = Math.floor(Math.random() * 256);
    e.target.style.backgroundColor =
      "rgb(" + rgbR + "," + rgbG + "," + rgbB + ")";
    e.target.setAttribute("id", "rainbow-mode");
    //get index of the clicked grid cell if rainbow mode is active
    getItem = e.target;
    //console.log(getItem);
  } else if (currentMode === "eraser") {
    e.target.style.backgroundColor = "rgb(255,255,255)";
  }
  if (currentMode === "fill") {
    //get index of the clicked grid cell if fill mode is active
    getItem = e.target;
    //console.log(getItem);
  }
}

//finding the clicked div's row and column indexes in order to use them
//in the FloodFill algorithm to apply BFS to find all the items and change their
//color till it reaches the outer border or any other closed inner border
let fillColor = (array, item) => {
  updateMatrix();
  let col;
  let row;
  for (let i = 0; i < currentSize * currentSize; i++) {
    for (let j = 0; j < currentSize * currentSize; j++) {
      //got an error when I tried to verify the item directly array[i][j]===item and switched to optional chaining
      //in order to short-circuit and return 'undefined' or null when checking for items outside the playing board
      //using optional chaining for when the cell coloring reaches the border
      if (array?.[i]?.[j] === item) {
        col = i;
        row = j;
        //console.log(col + " " + row);
      }
    }
  }
  let oldColor = item.style.backgroundColor;
  let newColor = colorValue.value;
  floodFillCheck(col, row, oldColor, newColor);
};

//flood fill algorithm to fill similarly-colored areas with a different(selected) color
let floodFillCheck = (i, j, oldColor, newColor) => {
  if (i < 0 || i >= currentSize || j < 0 || j >= currentSize) return;
  if (gridItemsArray2D[i][j].style.backgroundColor !== oldColor) return;

  gridItemsArray2D[i][j].style.backgroundColor = newColor;
  //based on the BFS algorithm, using backtracking we are constantly checking for cells
  //with different background color while applying the new selected color on them
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
