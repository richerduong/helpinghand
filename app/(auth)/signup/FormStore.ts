import { create } from 'zustand';

type State = {
  step: number,
  code: string[];
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type Actions = {
  setStep: (step: number) => void,
  setCode: (code: string[]) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  reset: () => void;
};

const initialState: State = {
  step: 1,
  code: ['', '', '', '', ''],
  email: '',
  password: '',
  firstName: '',
  lastName: '',
};

export const useFormStore = create<State & Actions>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setCode: (code) => set({ code }),
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  reset: () => set(initialState),
}));