// import { power } from "./utils";

function power(x: number, y: number): number {
  return y === 0 ? 1 : x * power(x, y - 1);
}

self.addEventListener("message", (message) => {
  const result = power(message.data, 100);
  self.postMessage(result);
});

export {};
