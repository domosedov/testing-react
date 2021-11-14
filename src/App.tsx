import * as React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEvent, useStore } from "effector-react";
import axios from "axios";
import { useAtom, Provider } from "jotai";
import * as model from "./model";
import { count as countAtom, atomScope } from "./count_atom";
import { power } from "./utils";
import MyWorker from "./my_worker?worker";

const Layout: React.FC = () => {
  const workerRef = React.useRef<Worker>();
  const [result, setResult] = React.useState(0);

  React.useEffect(() => {
    workerRef.current = new MyWorker();
    workerRef.current.addEventListener("message", (message) => {
      setResult(() => message.data);
    });
  }, []);

  return (
    <div>
      <header>
        <h1>Result: {result}</h1>
        <button onClick={() => workerRef.current?.postMessage(2)}>WORK!</button>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/jotai">Jotai</Link>
          <Link to="/valtio">Valtio</Link>
        </nav>
      </header>
      <br />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};

const Home: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .get<Todo[]>(
        "https://jsonplaceholder.typicode.com/todos?_limit=5&_start=5"
      )
      .then(({ data }) => {
        setTodos((prev) => [...prev, ...data]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    setIsLoading(true);
    axios
      .get<Todo[]>("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then(({ data }) => {
        setTodos(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>HomePage</h1>
      <h2>Todo List</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
      <button type="button" onClick={handleClick} disabled={isLoading}>
        Load More
      </button>
    </div>
  );
};

const About: React.FC = () => {
  const inc = useEvent(model.inc);
  const count = useStore(model.$count);
  return (
    <div>
      <h1>AboutPage Count: {count}</h1>
      <button type="button" onClick={inc}>
        Increment
      </button>
    </div>
  );
};

export const Counter: React.FC = () => {
  const [count, setCount] = useAtom(countAtom, atomScope);
  const inc = () => setCount((prev) => prev + 1);
  return (
    <section>
      <p role="paragraph">JotaiCount: {count}</p>
      <button type="button" onClick={inc}>
        +
      </button>
      <pre>Power: {power(2, count)}</pre>
    </section>
  );
};

export const Jotai: React.FC = () => {
  return (
    <React.Fragment>
      <h1>JotaiPage</h1>
      <Provider scope={atomScope}>
        <Counter />
      </Provider>
    </React.Fragment>
  );
};

const Valtio = React.lazy(() => import("./valtio"));

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="jotai" element={<Jotai />} />
        <Route
          path="valtio"
          element={
            <React.Suspense fallback={<div>Ho-ho</div>}>
              <Valtio />
            </React.Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default App;
