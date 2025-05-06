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
      !newChurch.email ||
      !newChurch.website ||
      !newChurch.image
    ) {
      return {
        success: false,
        message: "All required forms need to be filled in.",
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
    return { success: true, message: "Successfully created." };
  },

  fetchChurches: async () => {
    const res = await fetch("/api/churches");
    const data = await res.json();
    set({ churches: data.data });
  },

  deleteChurch: async (cid) => {
    const res = await fetch(`/api/churches/${cid}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ churches: state.churches.filter((church) => church._id !== cid) }));
    return { success: true, message: data.message };
  },

  updateChurch: async (cid, updatedChurch) => {
    const res = await fetch(`/api/churches/${cid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedChurch),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      churches: state.churches.map((church) =>
        church._id === cid ? data.data : church
      ),
    }));
    return { success: true, message: data.message };
  },
}));
