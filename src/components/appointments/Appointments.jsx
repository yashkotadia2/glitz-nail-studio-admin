import React from "react";
import Header from "../global/Header";
import usePanelStore from "@/zustand/usePanelStore";
import AppointmentModal from "./AppointmentModal";

const Appointments = () => {
  const { isAppointmentModalOpen, setIsAppointmentModalOpen } = usePanelStore();

  const handleAppointmentClick = () => {
    setIsAppointmentModalOpen(true);
  };

  return (
    <div>
      <Header
        title="Appointments"
        buttonText="Add Appointment"
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
