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
      (!newChurch.image && !newChurch.imageFile)
    ) {
      return {
        success: false,
        message: "All required forms need to be filled in.",
      };
    }

    // If there's a file, convert it to a data URL
    let churchData = { ...newChurch };
    if (newChurch.imageFile) {
      try {
        const dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(newChurch.imageFile);
        });
        churchData.image = dataUrl;
        delete churchData.imageFile; // Remove the file object
      } catch (error) {
        return {
          success: false,
          message: "Error processing image file.",
        };
      }
    }

    const res = await fetch("/api/churches", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(churchData),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ message: "Server error" }));
      return {
        success: false,
        message: errorData.message || `HTTP error! status: ${res.status}`,
      };
    }

    const data = await res.json();
    if (!data.success) {
      return {
        success: false,
        message: data.message || "Failed to create church",
      };
    }

    set((state) => ({ churches: [...state.churches, data.data] }));
    return { success: true, message: "Successfully created.", data: data.data };
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

    set((state) => ({
      churches: state.churches.filter((church) => church._id !== cid),
    }));
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

  fetchChurch: async (cid) => {
    const res = await fetch(`/api/churches/${cid}`);
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };
    return { success: true, data: data.data };
  },
}));
