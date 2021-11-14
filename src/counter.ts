import { proxy, subscribe } from "valtio";

class Counter {
  private _timer?: number;

  constructor(private count: number) {}

  increment() {
    ++this.count;
  }

  decrement() {
    --this.count;
  }

  getCount() {
    return this.count;
  }

  run() {
    this._timer = window.setInterval(() => {
      ++this.count;
    }, 500);
  }

  stop() {
    if (this._timer) {
      window.clearInterval(this._timer);
    }
  }
}

export const counter = proxy(new Counter(0));

subscribe(counter, () => console.log(counter.getCount()));
