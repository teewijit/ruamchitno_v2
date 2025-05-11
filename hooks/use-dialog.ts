import { create } from "zustand";

interface DialogStore {
  isOpen: boolean;
  data: any;
  openDialog: (data: any) => void;
  closeDialog: () => void;
}

export const useDialog = create<DialogStore>((set) => ({
  isOpen: false,
  data: null,
  openDialog: (data: any) => set({ isOpen: true, data }),
  closeDialog: () => set({ isOpen: false, data: null }),
}));
