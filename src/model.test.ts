import { fork, allSettled } from "effector";
import * as model from "./model";

describe("test counter model", () => {
  it("test with domain", async () => {
    const scope = fork(model.counterDomain, {
      values: [[model.$count, 10]],
    });

    await allSettled(model.inc, { scope });

    expect(scope.getState(model.$doubleCount)).toBe(22);
  });
});
