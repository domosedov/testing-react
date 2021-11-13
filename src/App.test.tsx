import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { fork } from "effector";
import { Provider } from "effector-react/scope";
import {
  render as originalRender,
  RenderOptions,
  waitFor,
} from "@testing-library/react";
import user from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import App from "./App";

const server = setupServer(
  rest.get("https://jsonplaceholder.typicode.com/todos", (req, res, ctx) => {
    const query = req.url.searchParams;
    const _limit = query.get("_limit");

    return res(ctx.json([{ id: 1, title: "test" }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const AllProviders: React.FC = ({ children }) => {
  const scope = fork();
  return (
    <MemoryRouter initialEntries={["/about"]}>
      <Provider value={scope}>{children}</Provider>
    </MemoryRouter>
  );
};

const render = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => originalRender(ui, { wrapper: AllProviders, ...options });

describe("App", () => {
  it("render app", () => {
    const { getByText, getByRole } = render(<App />);
    const button = getByRole("button");

    user.click(button);
    user.click(button);

    expect(getByText(/Count: 2/)).toBeInTheDocument();
  });

  it("move to home", async () => {
    const { debug, getByText, getByRole, getAllByRole } = render(<App />);
    const links = getAllByRole("link");
    const homeLink = links.find((link) => link.textContent === "Home");

    user.click(homeLink!);

    expect(getByText(/Loading/)).toBeInTheDocument();

    await waitFor(() => {
      expect(getByText(/HomePage/)).toBeInTheDocument();
      expect(getAllByRole("listitem")).toHaveLength(1);
      expect(getByText(/Todo List/)).toBeInTheDocument();
      debug();
    });
  });
});
