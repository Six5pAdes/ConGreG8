import { create } from "zustand";

export const useReviewStore = create((set) => ({
  reviews: [],
  isLoading: false,
  error: null,

  setReviews: (reviews) => set({ reviews }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  createReview: async (newReview) => {
    try {
      set({ isLoading: true, error: null });

      if (!newReview.rating || newReview.rating < 1 || newReview.rating > 5) {
        throw new Error("All required forms need to be filled in.");
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({ reviews: [...state.reviews, data.data] }));
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

  fetchReviews: async () => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      set({ reviews: data.data });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchReview: async (rid) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/reviews/${rid}`);
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

  fetchReviewByUser: async (ridu) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/reviews/users/${ridu}`);
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

  fetchReviewByChurch: async (ridc) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/reviews/churches/${ridc}`);
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

  updateReview: async (rid, updatedReview) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/reviews/${rid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedReview),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === rid ? data.data : review
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

  deleteReview: async (rid) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/reviews/${rid}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      set((state) => ({
        reviews: state.reviews.filter((review) => review._id !== rid),
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
