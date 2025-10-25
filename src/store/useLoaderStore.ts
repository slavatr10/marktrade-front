import { create } from "zustand";

interface LoaderStore {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const useLoaderStore = create<LoaderStore>((set) => ({
  loading: false,
  startLoading: () => set({ loading: true }),
  stopLoading: () => set({ loading: false }),
}));
