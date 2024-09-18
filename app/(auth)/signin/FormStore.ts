import { create } from 'zustand';

type State = {
  email: string;
  password: string;
  error: string;
};

type Actions = {
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setError: (error: string) => void;
  reset: () => void;
};

const initialState: State = {
  email: '',
  password: '',
  error: '',
};

export const useFormStore = create<State & Actions>((set) => ({
  ...initialState,
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setError: (error: string) => set({ error }),
  reset: () => set(initialState),
}));