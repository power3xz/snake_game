async function init() {
  const importObject = {
    console: {
      log: () => {
        console.log("Just logging Something!");
      },
      error: () => {
        console.log("I am just error");
      },
    },
  };
  const response = await fetch("./sum.wasm");
  const buffer = await response.arrayBuffer();
  const wasm = await WebAssembly.instantiate(buffer, importObject);

  const sumFunction = wasm.instance.exports.sum;
  const wasmMemory = wasm.instance.exports.mem;
  debugger;
  const result = sumFunction(10, 50);
  console.log(result);
}
init();
