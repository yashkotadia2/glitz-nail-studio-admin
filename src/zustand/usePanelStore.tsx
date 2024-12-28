import { create } from "zustand";

type PanelStore = {
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (isOpen: boolean) => void;

  isMenuModalOpen: boolean;
  setIsMenuModalOpen: (isOpen: boolean) => void;
};

const usePanelStore = create<PanelStore>()((set) => ({
  isAppointmentModalOpen: false,
  setIsAppointmentModalOpen: (isOpen) =>
    set({ isAppointmentModalOpen: isOpen }),

  isMenuModalOpen: false,
  setIsMenuModalOpen: (isOpen) => set({ isMenuModalOpen: isOpen }),
}));

export default usePanelStore;
