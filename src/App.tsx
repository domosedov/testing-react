import * as React from "react";
import { Routes, Route, Outlet, Link } from "react-router-dom";
import { useEvent, useStore } from "effector-react";
import axios from "axios";
import * as model from "./model";

const Layout: React.FC = () => {
  return (
    <div>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <br />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};

const Home: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

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

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
    </Routes>
  );
};

export default App;
