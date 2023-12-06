import init, { World, Direction, GameStatus } from "snake_game";
import { rnd } from "./utils/rnd";

init().then((wasm) => {
  const CELL_SIZE = 16;
  const WORLD_WIDTH = 8;
  const SNAKE_SPAWN_IDX = rnd(WORLD_WIDTH * WORLD_WIDTH);

  const world = World.new(WORLD_WIDTH, SNAKE_SPAWN_IDX);
  const worldWidth = world.width();
  const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
  const gameStatus = document.getElementById("game-status");
  const gameControlBtn = document.getElementById("game-control-btn");
  const gamePoints = document.getElementById("points");
  const ctx = canvas.getContext("2d");
  canvas.height = CELL_SIZE * worldWidth;
  canvas.width = CELL_SIZE * worldWidth;

  gameControlBtn.addEventListener("click", () => {
    const status = world.game_status();
    if (status === undefined) {
      gameControlBtn.textContent = "Playing...";
      world.start_game();
      play();
    } else {
      location.reload();
    }
  });

  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "KeyW":
        world.change_snake_dir(Direction.Up);
        break;
      case "KeyD":
        world.change_snake_dir(Direction.Right);
        break;
      case "KeyS":
        world.change_snake_dir(Direction.Down);
        break;
      case "KeyA":
        world.change_snake_dir(Direction.Left);
        break;
    }
  });

  function drawReward() {
    const idx = world.reward_cell();
    const col = idx % worldWidth;
    const row = Math.floor(idx / worldWidth);
    ctx.beginPath();
    ctx.fillStyle = "#990000";
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    ctx.stroke();
    if (idx === 1000) {
      alert("You won!");
    }
  }

  function drawWorld() {
    ctx.beginPath();
    for (let x = 0; x < worldWidth + 1; x++) {
      ctx.moveTo(CELL_SIZE * x, 0);
      ctx.lineTo(CELL_SIZE * x, worldWidth * CELL_SIZE);
    }
    for (let y = 0; y < worldWidth + 1; y++) {
      ctx.moveTo(0, CELL_SIZE * y);
      ctx.lineTo(worldWidth * CELL_SIZE, CELL_SIZE * y);
    }
    ctx.stroke();
  }

  function drawGameStatus() {
    const status = world.game_status();
    gameStatus.textContent = world.game_status_text();
    gamePoints.textContent = world.points().toString();

    if (status === GameStatus.Won || status === GameStatus.Lost) {
      gameControlBtn.textContent = "Re-Play";
    }
  }

  function drawSnake() {
    const snakeCells = new Uint32Array(
      wasm.memory.buffer,
      world.snake_cells(),
      world.snake_length()
    );

    snakeCells
      .filter((cellIdx, i) => !(i > 0 && cellIdx === snakeCells[0]))
      .forEach((cellIdx, i) => {
        const col = cellIdx % worldWidth;
        const row = Math.floor(cellIdx / worldWidth);
        ctx.fillStyle = i === 0 ? "#7878db" : "#333333";
        ctx.beginPath();
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      });
    ctx.stroke();
  }

  function paint() {
    drawWorld();
    drawReward();
    drawSnake();
    drawGameStatus();
  }

  function play() {
    console.log("playing!");
    const fps = 10;
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.step();
      paint();
      requestAnimationFrame(play);
    }, 1000 / fps);
  }
  paint();
});
