import { createDomain, createApi, createStore, sample } from "effector";

const INITIAL_COUNT = 0;

export const counterDomain = createDomain("counter");

export const $count = counterDomain.store(INITIAL_COUNT);

export const { dec, inc, reset } = createApi($count, {
  dec: (count) => count - 1,
  inc: (count) => count + 1,
  reset: () => INITIAL_COUNT,
});

export const $doubleCount = createStore(0);

sample({
  clock: $count,
  fn: (count) => count * 2,
  target: $doubleCount,
});
