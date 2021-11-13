import * as React from "react";
import { render } from "@testing-library/react";
import user from "@testing-library/user-event";
import { Jotai } from "./App";
import * as utils from "./utils";

jest.mock("./utils");

describe("Jotai", () => {
  it("test power fn", () => {
    let { getByRole } = render(<Jotai />);
    const button = getByRole("button");
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/\+/);
    expect(utils.power).toHaveBeenCalledWith(2, 0);

    user.click(button);
    expect(utils.power).toHaveBeenCalledWith(2, 1);
  });
});
