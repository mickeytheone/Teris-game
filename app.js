document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let timerId;
  let score = 0;
  const colors = [
    "orange",
    "red",
    "purple",
    "green",
    "blue",
    "white",
    "yellow",
  ];

  //the tetrominoes
  const jTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];
  const lTetromino = [
    [0, 1, width + 1, width * 2 + 1],
    [2, width, width + 1, width + 2],
    [1, , width + 1, width * 2 + 1, width * 2 + 2],
    [0, 1, 2, width],
  ];

  const sTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];
  const zTetromino = [
    [2, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
    [2, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width * 2 + 1, width * 2 + 2],
  ];

  const tTetromino = [
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
  ];

  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];

  const theTetriminos = [
    jTetromino,
    lTetromino,
    sTetromino,
    zTetromino,
    tTetromino,
    oTetromino,
    iTetromino,
  ];
  let currentPosition = 4;
  let currentRotation = 0;

  //create a random tetrimino and its rotation
  let random = Math.floor(Math.random() * theTetriminos.length);
  let current = theTetriminos[random][currentRotation];

  //add the tetrimino to the grid with a draw function
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  //remove the tetrimino to the grid with a draw function
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //movedown function and timer for auto movement
  timerId = setInterval(moveDown, 1000);

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }
  //freeze the squares at the bottom with a freeze function
  function freeze() {
    if (
      current.some((index) =>
        squares[currentPosition + index + width].classList.contains("taken")
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );

      //make a new tetromino to the grid
      //random = nextRandom;
      random = Math.floor(Math.random() * theTetriminos.length);
      current = theTetriminos[random][currentRotation];
      currentPosition = 4;
      draw();
    }
  }

  //assign functions to bind with keycodes
  function control(event) {
    //   event.preventDefault();

    if (event.keyCode === 37) {
      moveLeft();
    } else if (event.keyCode === 39) {
      moveRight();
    } else if (event.keyCode === 40) {
      moveDown();
    } else if (event.keyCode === 38) {
      rotate();
    }
  }
  document.addEventListener("keydown", control);

  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );
    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }
    draw();
  }

  function rotate() {
    undraw();
    currentRotation += 1;
    if (currentRotation === current.length) currentRotation = 0;
    current = theTetriminos[random][currentRotation];
    checkRotatedPosition();
    draw();
  }
});
