import * as React from "react";
import { MemoryRouter } from "react-router-dom";
import { fork } from "effector";
import { Provider as EffectorProvider } from "effector-react/scope";
import { Provider as JotaiProvider } from "jotai";
import {
  render as originalRender,
  RenderOptions,
  waitFor,
} from "@testing-library/react";
import user from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import * as faker from "faker";
import App, { Todo } from "./App";
import { atomScope, count } from "./count_atom";

const todos: Todo[] = new Array(100).fill(null).map(() => ({
  id: faker.datatype.number(),
  title: faker.name.title(),
  completed: faker.datatype.boolean(),
  userId: faker.datatype.number(),
}));

const server = setupServer(
  rest.get("https://jsonplaceholder.typicode.com/todos", (req, res, ctx) => {
    const query = req.url.searchParams;

    const _limit = Number(query.get("_limit") ?? 0);
    const _start = Number(query.get("_start") ?? 0);

    const data = todos.slice(_start, _start + _limit);

    return res(ctx.json(data));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const AllProviders: React.FC = ({ children }) => {
  const scope = fork();
  return (
    <MemoryRouter initialEntries={["/about"]}>
      <EffectorProvider value={scope}>{children}</EffectorProvider>
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
      expect(getAllByRole("listitem")).toHaveLength(5);
    });

    const loadMoreButton = getByRole("button");

    user.click(loadMoreButton);

    expect(getByText(/Loading/)).toBeInTheDocument();

    await waitFor(() => {
      expect(getAllByRole("listitem")).toHaveLength(10);
    });
  });

  it("Jotai Page", () => {
    const { getAllByRole, getByRole, getByText } = render(<App />);
    const links = getAllByRole("link");
    const link = links.find((link) => link.textContent === "Jotai");
    user.click(link!);

    expect(getByRole("heading")).toHaveTextContent(/JotaiPage/);

    const incButton = getByRole("button");
    user.click(incButton);
    user.click(incButton);
    user.click(incButton);

    expect(getByRole("paragraph")).toHaveTextContent(/Count: 3/);
  });
});
