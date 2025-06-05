import { create } from 'zustand';

const useStore = create((set) => ({
  isAuthenticated: false,
  user: null,
  setAuth: (status, userData) => set({ isAuthenticated: status, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useStore;