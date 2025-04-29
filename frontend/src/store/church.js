import { create } from "zustand";

export const useChurchStore = create((set) => ({
  churches: [],
  setChurches: (churches) => set({ churches }),
  createChurch: async (newChurch) => {
    if (
      !newChurch.name ||
      !newChurch.address ||
      !newChurch.city ||
      !newChurch.state ||
      !newChurch.phone ||
      !newChurch.email ||
      !newChurch.website
    ) {
      return {
        success: false,
        message: "All required forms need to be filled in",
      };
    }

    const res = await fetch("/api/churches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(newChurch),
    });

    const data = await res.json();
    set((state) => ({ churches: [...state.churches, data.data] }));
    return { success: true, message: "Successfully created" };
  },
}));
