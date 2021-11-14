import * as React from "react";
import Valtio from "./valtio";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";

describe("<Valtio />", () => {
  it("should have no a11y violations", async () => {
    const { container } = render(<Valtio />);
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
