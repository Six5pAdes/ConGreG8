import { create } from "zustand";

export const useVolunteerOpStore = create((set) => ({
  volunteerOps: [],
  isLoading: false,
  error: null,

  setReviews: (volunteerOps) => set({ volunteerOps }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  createVolunteerOp: async (newVolunteerOp) => {
    try {
      set({ isLoading: true, error: null });

      if (
        !newVolunteerOp.title ||
        !newVolunteerOp.description ||
        newVolunteerOp.isActive === undefined ||
        newVolunteerOp.isMember === undefined
      ) {
        throw new Error("All required forms need to be filled in.");
      }

      const res = await fetch("/api/volunteering", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newVolunteerOp),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({ volunteerOps: [...state.volunteerOps, data.data] }));
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

  fetchVolunteerOps: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch("/api/volunteering");
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set({ reviews: data.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSingleVolunteerOp: async (vid) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/volunteering/${vid}`);
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

  fetchVolunteerOpsByChurch: async (vidc) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/volunteering/churches/${vidc}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set({ volunteerOps: data.data });
      return { success: true, data: data.data };
    } catch (error) {
      set({ error: error.message });
      return { success: false, message: error.message };
    } finally {
      set({ isLoading: false });
    }
  },

  updateVolunteerOp: async (vid, updatedVolunteerOp) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/volunteering/${vid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedVolunteerOp),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        volunteerOps: state.volunteerOps.map((volunteerOp) =>
          volunteerOp._id === vid ? data.data : volunteerOp
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

  deleteVolunteerOp: async (vid) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/volunteering/${vid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        volunteerOps: state.volunteerOps.filter(
          (volunteerOp) => volunteerOp._id !== vid
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
