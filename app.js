document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let timerId;
  let score = 0;
  let nextRandom = 0;
  const colors = [
    "MidnightBlue",
    "Green",
    "Orange",
    "HotPink",
    "DarkRed",
    "Brown",
    "Magenta",
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

  //movedown function
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
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetriminos.length);
      current = theTetriminos[random][currentRotation];
      currentPosition = 4;
      draw();
      nextUp();
      addScore();
      gameOver();
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
    checkRotatedPosition(currentPosition);
    draw();
  }

  // // check the squares after they've been rotated
  // function isAtRight() {
  //   return current.some((index) => (currentPosition + index + 1) % width === 0);
  // }

  // function isAtLeft() {
  //   return current.some((index) => (currentPosition + index) % width === 0);
  // }

  // function checkRotatedPosition(currentPosition) {
  //   P = currentPosition; //get current position.  Then, check if the piece is near the left side.
  //   if ((P + 1) % width < 4) {
  //     //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).
  //     if (isAtRight()) {
  //       //use actual position to check if it's flipped over to right side
  //       currentPosition += 1; //if so, add one to wrap it back around
  //       checkRotatedPosition(P); //check again.  Pass position from start, since long block might need to move more.
  //     }
  //   } else if (P % width > 5) {
  //     if (isAtLeft()) {
  //       currentPosition -= 1;
  //       checkRotatedPosition(P);
  //     }
  //   }
  // }

  // display the upcoming Tetromino
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  const displayIndex = 0;

  const upNextTetrominoes = [
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //jTetromino
    [0, 1, displayWidth + 1, displayWidth * 2 + 1], //lTetromino
    [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //sTetromino
    [2, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1], //zTetromino
    [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
    [0, 1, displayWidth, displayWidth + 1], //oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //iTetromino
  ];

  function nextUp() {
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  // display the score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];

      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  // start Button function
  startBtn.addEventListener("click", () => {
    if (startBtn.innerHTML === "Restart") {
      location.reload(); //   temporary solution
    } else if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      timerId = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetriminos.length);
      nextUp();
    }
  });

  // game over
  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      scoreDisplay.innerHTML = "end";
      clearInterval(timerId);
      document.removeEventListener("keydown", control);
      startBtn.innerHTML = "Restart";
    }
  }
});
