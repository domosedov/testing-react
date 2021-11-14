import * as React from "react";
import { useSnapshot } from "valtio";
import { counter } from "./counter";

export const Valtio: React.FC = () => {
  const snap = useSnapshot(counter);
  return (
    <div>
      <h1>ValtioPage</h1>
      <p>Count: {snap.getCount()}</p>
      <button onClick={() => counter.increment()}>Inc</button>
      <button onClick={() => counter.run()}>Run!</button>
      <button onClick={() => counter.stop()}>Stop</button>
    </div>
  );
};

export default Valtio;
