import { create } from 'zustand';

interface AIAssistantState {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
}

export const useAIAssistantStore = create<AIAssistantState>((set) => ({
  open: false,
  setOpen: (open) => set({ open }),
  toggle: () => set((state) => ({ open: !state.open })),
})); 