import init, { World } from "snake_game";

init().then((wasm) => {
  const world = World.new();
  const canvas = document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");
});
