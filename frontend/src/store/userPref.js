import { create } from "zustand";

export const useUserPrefStore = create((set) => ({
  userPrefs: [],
  currentUserPrefs: null,
  isLoading: false,
  error: null,

  setUserPrefs: (userPrefs) => set({ userPrefs }),
  setCurrentUserPrefs: (prefs) => set({ currentUserPrefs: prefs }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  createUserPref: async (newUserPref) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch("/api/user-prefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserPref),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        userPrefs: [...state.userPrefs, data.data],
        currentUserPrefs: data.data,
      }));

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

  fetchUserPrefs: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch("/api/user-prefs");
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set({ userPrefs: data.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSingleUserPref: async (upid) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/user-prefs/${upid}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set({ currentUserPrefs: data.data });
      return { success: true, data: data.data };
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserPref: async (upid, updatedUserPref) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`/api/user-prefs/${upid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUserPref),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        userPrefs: state.userPrefs.map((userPref) =>
          userPref._id === upid ? data.data : userPref
        ),
        currentUserPrefs: data.data,
      }));

      return { success: true, message: data.message };
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  deleteUserPref: async (upid) => {
    try {
      set({ isLoading: true, error: null });

      const res = await fetch(`/api/user-prefs/${upid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        userPrefs: state.userPrefs.filter((userPref) => userPref._id !== upid),
        currentUserPrefs: null,
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
