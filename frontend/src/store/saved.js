import { create } from "zustand";

export const useSavedStore = create((set) => ({
  savedChurches: [],
  isLoading: false,
  error: null,

  setReviews: (savedChurches) => set({ savedChurches }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  createSaved: async (newSaved) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch("/api/saved", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSaved),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({ savedChurches: [...state.savedChurches, data.data] }));
      return {
        success: true,
        message: "Successfully created.",
        data: data.data,
      };
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSaved: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch("/api/saved");
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set({ reviews: data.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSingleSaved: async (sid) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/saved/${sid}`);
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

  fetchSavedByUser: async (sidu) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/saved/user/${sidu}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set({ reviews: data.data });
      return { success: true, data: data.data };
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteSaved: async (sid) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/saved/${sid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        savedChurches: state.savedChurches.filter((saved) => saved._id !== sid),
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
