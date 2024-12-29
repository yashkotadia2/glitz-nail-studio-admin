import React from "react";
import Header from "../global/Header";
import usePanelStore from "@/zustand/usePanelStore";
import AppointmentModal from "./AppointmentModal";
import { useScreenWidth } from "@/hooks/useScreenWidth";

const buttonText = {
  mobile: "",
  tablet: "Appointment",
  laptop: "Add Appointment",
  tv: "Add Appointment",
};

const Appointments = () => {
  const deviceType = useScreenWidth();
  const { isAppointmentModalOpen, setIsAppointmentModalOpen } = usePanelStore();

  const handleAppointmentClick = () => {
    setIsAppointmentModalOpen(true);
  };

  return (
    <div>
      <Header
        title="Appointments"
        buttonText={buttonText[deviceType]}
        onClick={handleAppointmentClick}
      />
      <AppointmentModal
        open={isAppointmentModalOpen}
        onCancel={() => setIsAppointmentModalOpen(false)} // Close the modal
      />
    </div>
  );
};

export default Appointments;
