import { create } from "zustand";

export const churchAttrStore = create((set) => ({
  churchAttrs: [],
  isLoading: false,
  error: null,

  setChurchAttrs: (churchAttrs) => set({ churchAttrs }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  createChurchAttr: async (newChurchAttr) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch("/api/attributes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newChurchAttr),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({ churchAttrs: [...state.churchAttrs, data.data] }));
      return {
        success: true,
        message: "Successfully created.",
        data: data,
      };
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchChurchAttrs: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch("/api/attributes");
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set({ reviews: data.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSingleChurchAttr: async (caid) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/attributes/${caid}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return { success: true, data: data.data };
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  updateChurchAttr: async (caid, updatedChurchAttr) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`/api/attributes/${caid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedChurchAttr),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        churchAttrs: state.churchAttrs.map((churchAttr) =>
          churchAttr._id === caid ? data.data : churchAttr
        ),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteChurchAttr: async (caid) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`/api/attributes/${caid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        churchAttrs: state.userPrefs.filter(
          (churchAttr) => churchAttr._id !== caid
        ),
      }));

      return { success: true, message: data.message };
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },
}));
