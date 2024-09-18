import { create } from 'zustand';

type Socials = {
  linkedin: string;
  github: string;
  portfolio: string;
}

type State = {
  step: number,
  code: string[];
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  socials: Socials;
};

type Actions = {
  setStep: (step: number) => void,
  setCode: (code: string[]) => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;
  setSocials: (socials: Partial<Socials>) => void;
  reset: () => void;
};

const initialState: State = {
  step: 1,
  code: ['', '', '', '', ''],
  email: '',
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  socials: {
    linkedin: '',
    github: '',
    portfolio: ''
  },
};

export const useFormStore = create<State & Actions>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setCode: (code) => set({ code }),
  setEmail: (email) => set({ email }),
  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  setFirstName: (firstName) => set({ firstName }),
  setLastName: (lastName) => set({ lastName }),
  setSocials: (socials) => set((state) => ({ socials: { ...state.socials, ...socials } })),
  reset: () => set(initialState),
}));