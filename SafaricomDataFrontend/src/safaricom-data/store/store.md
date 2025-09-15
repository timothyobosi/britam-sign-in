# Store

For state that needs to be handled globally

- Use Zustand with TS --> [Zustand Docs](https://docs.pmnd.rs/zustand/getting-started/introduction)

Template:

```TS
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
```
