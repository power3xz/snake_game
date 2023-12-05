import init, { World } from "snake_game";

init().then((wasm) => {
  const world = World.new();
  console.log(world.width());
});
