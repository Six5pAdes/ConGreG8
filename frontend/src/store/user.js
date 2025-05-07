import { create } from "zustand";

export const useUserStore = create((set) => ({
  users: [],
  currentUser: null,
  setUsers: (users) => set({ users }),
  setCurrentUser: (user) => set({ currentUser: user }),

  fetchUser: async (uid) => {
    const res = await fetch(`/api/users/profile/${uid}`);
    const data = await res.json();

    if (!data.success) return { success: false, message: data.message };
    return { success: true, data: data.data };
  },

  createUser: async (newUser) => {
    if (
      newUser.isChurchgoer === true &&
      (!newUser.firstName ||
        !newUser.lastName ||
        !newUser.username ||
        !newUser.email ||
        !newUser.password)
    ) {
      return {
        success: false,
        message: "Email, password, full name, and username are required.",
      };
    }

    if (
      newUser.isChurchgoer === false &&
      (!newUser.email || !newUser.password || !newUser.churchName)
    ) {
      return {
        success: false,
        message: "Email, password, and church name are required.",
      };
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ users: [...state.users, data.data] }));
    return { success: true, message: "User created successfully." };
  },

  updateUser: async (uid, updatedUser) => {
    const res = await fetch(`/api/users/${uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({
      users: state.users.map((user) => (user._id === uid ? data.data : user)),
    }));
    return { success: true, message: "User updated successfully." };
  },

  deleteUser: async (uid) => {
    const res = await fetch(`/api/users/${uid}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set((state) => ({ users: state.users.filter((user) => user._id !== uid) }));
    return { success: true, message: "User deleted successfully." };
  },

  login: async (credentials) => {
    if (!credentials.email || !credentials.password) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message:
            data.message || "Login failed. Please check your credentials.",
        };
      }

      if (!data.success) {
        return {
          success: false,
          message: data.message || "Login failed. Please try again.",
        };
      }

      set({ currentUser: data.data });
      return { success: true, message: "Login successful." };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "An error occurred during login. Please try again.",
      };
    }
  },

  logout: () => {
    set({ currentUser: null });
    return { success: true, message: "Logged out successfully." };
  },

  fetchAllUsers: async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    if (!data.success) return { success: false, message: data.message };

    set({ users: data.data });
    return { success: true, message: "Users fetched successfully." };
  },
}));
