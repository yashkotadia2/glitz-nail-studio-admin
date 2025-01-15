import React, { useState } from "react";
import Header from "../global/Header";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import HolidayTable from "./HolidayTable";
import HolidayModal from "./HolidayModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosAPI from "@/apis/useAxios";
import { API_ROUTES } from "@/apis/apiRoutes";
import { THoliday } from "@/types/types";
import toast from "react-hot-toast";

const buttonText = {
  mobile: "",
  tablet: "Holiday",
  laptop: "Add Holiday",
  tv: "Add Holiday",
};

const Holiday = () => {
  const queryClient = useQueryClient();

  const { postData } = useAxiosAPI();
  const deviceType = useScreenWidth();
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState<boolean>(false); // Modal state

  const { mutate: addHoliday, isPending: isAddingHoliday } = useMutation({
    mutationFn: (data: THoliday) => postData(API_ROUTES.HOLIDAY.ADD, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["holidays"],
      });
      setIsHolidayModalOpen(false);
      toast.success("Holiday added successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to add holiday");
    },
  });

  const handleAddHolidayClick = () => {
    setIsHolidayModalOpen(true);
  };

  return (
    <div>
      <Header
        title="Holiday"
        buttonText={buttonText[deviceType]}
        onClick={handleAddHolidayClick}
      />
      <HolidayTable />
      <HolidayModal
        loading={isAddingHoliday}
        open={isHolidayModalOpen}
        onCancel={() => setIsHolidayModalOpen(false)} // Close the modal
        onSubmit={(data) => {
          addHoliday(data);
        }} // Close the modal
      />
    </div>
  );
};

export default Holiday;
