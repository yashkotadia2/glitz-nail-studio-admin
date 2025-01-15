import React from "react";
import Header from "../global/Header";
import usePanelStore from "@/zustand/usePanelStore";
import AppointmentModal from "./AppointmentModal";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import useAxiosAPI from "@/apis/useAxios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ROUTES } from "@/apis/apiRoutes";
import AppointmentsTable from "./AppointmentsTable";
import toast from "react-hot-toast";

const buttonText = {
  mobile: "",
  tablet: "Appointment",
  laptop: "Add Appointment",
  tv: "Add Appointment",
};

const Appointments = () => {
  const deviceType = useScreenWidth();
  const queryClient = useQueryClient();

  const { postData } = useAxiosAPI();
  const { isAppointmentModalOpen, setIsAppointmentModalOpen } = usePanelStore();
  const { mutate: addAppointment, isPending: isAddingAppointment } =
    useMutation({
      mutationFn: (data) => postData(API_ROUTES.APPOINTMENT.ADD, data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["appointments"],
        });
        setIsAppointmentModalOpen(false);
        toast.success("Appointment added successfully");
      },
      onError: (error) => {
        console.log(error);
        toast.error("Failed to add appointment");
      },
    });

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
        loading={isAddingAppointment}
        open={isAppointmentModalOpen}
        onCancel={() => setIsAppointmentModalOpen(false)} // Close the modal
        onSubmit={(data) => {
          addAppointment(data);
        }} // Close the modal
      />
      <AppointmentsTable />
    </div>
  );
};

export default Appointments;
