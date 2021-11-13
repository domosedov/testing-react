import { sum } from "../sum";

describe("sum", () => {
  it("test 2+2=4", () => {
    expect(sum(2, 2)).toBe(4);
  });
});
