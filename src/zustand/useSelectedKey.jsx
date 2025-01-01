import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define the zustand store
const useSelectedKey = create(
  persist(
    (set) => ({
      selectedKey: "appointments", // Default value for selectedKey
      setSelectedKey: (key) => set({ selectedKey: key }), // Setter function for selectedKey
    }),
    {
      name: "selected-key-storage", // Name of the storage key in localStorage
      getStorage: () => localStorage, // Specify the storage to use (localStorage)
    }
  )
);

export default useSelectedKey;
