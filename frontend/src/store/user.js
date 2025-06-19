import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      users: [],
      currentUser: null,
      setUsers: (users) => set({ users }),
      setCurrentUser: (user) =>
        set({
          currentUser: user,
        }),

      fetchUser: async (uid) => {
        const res = await fetch(`/api/users/${uid}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };
        set({ currentUser: data.data });
        return { success: true, data: data.data };
      },

      createUser: async (newUser) => {
        if (
          newUser.userType === "churchgoer" &&
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
          newUser.userType === "churchRep" &&
          (!newUser.email || !newUser.password || !newUser.churchName)
        ) {
          return {
            success: false,
            message: "Email, password, and church name are required.",
          };
        }

        try {
          const res = await fetch("/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newUser),
          });

          const data = await res.json();
          if (!data.success) return { success: false, message: data.message };

          set((state) => ({
            users: [...state.users, data.data],
            currentUser: data.data,
          }));
          return { success: true, message: "User created successfully." };
        } catch (error) {
          console.error("Error creating user:", error);
          return {
            success: false,
            message: "Failed to create user. Please try again.",
          };
        }
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
          users: state.users.map((user) =>
            user._id === uid ? data.data : user
          ),
        }));
        return { success: true, message: "User updated successfully." };
      },

      deleteUser: async (uid) => {
        const res = await fetch(`/api/users/${uid}`, {
          method: "DELETE",
        });

        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set((state) => ({
          users: state.users.filter((user) => user._id !== uid),
          currentUser: null,
        }));
        return { success: true, message: data.message };
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
            credentials: "include",
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

      logout: async () => {
        try {
          const res = await fetch("/api/users/logout", {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok) {
            throw new Error("Logout failed");
          }
          set({ currentUser: null });
          return { success: true, message: "Logged out successfully." };
        } catch (error) {
          console.error("Logout error:", error);
          return {
            success: false,
            message: "Failed to logout. Please try again.",
          };
        }
      },

      fetchAllUsers: async () => {
        const res = await fetch("/api/users");
        const data = await res.json();
        if (!data.success) return { success: false, message: data.message };

        set({ users: data.data });
        return { success: true, message: "Users fetched successfully." };
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);
