import React, { JSX, useEffect, useState } from "react";
import { Form, Input, DatePicker, TimePicker, Select, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { TAppointment, TMenu } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import useAxiosAPI from "@/apis/useAxios";
import { API_ROUTES } from "@/apis/apiRoutes";
import toReadableString from "@/lib/toReadableString";
import RUPEE_SYMBOL from "@/lib/rupeeSymbol";

import "react-phone-number-input/style.css";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import toast from "react-hot-toast";

const { TextArea } = Input;

type AppointmentModalProps = {
  loading: boolean;
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: TAppointment) => void;
  initialValues?: TAppointment;
};

const AppointmentModal = ({
  loading,
  open,
  onCancel,
  onSubmit,
  initialValues,
}: AppointmentModalProps) => {
  const [form] = Form.useForm();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [phoneValue, setPhoneValue] = useState<string | undefined>();

  const { getData } = useAxiosAPI();

  const {
    data: menuItems,
    isPending: isMenuLoading,
    error: menuError,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: () => getData(API_ROUTES.MENU.GET_ALL),
  });

  const {
    data: workingHours,
    isPending: isWorkingHourLoading,
    error: workingHoursError,
  } = useQuery({
    queryKey: ["working-hours"],
    queryFn: () => getData(API_ROUTES.WORKING_HOURS.GET),
  });

  const {
    data: holidays,
    isPending: isHolidayLoading,
    error: holidaysError,
  } = useQuery({
    queryKey: ["holidays"],
    queryFn: () => getData(API_ROUTES.HOLIDAY.GET_ALL),
  });

  console.log("holidays", holidays);
  console.log("workingHours", workingHours);

  const handleSubmit = (values: TAppointment) => {
    onSubmit(values);
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        date: dayjs(initialValues.date),
        time: dayjs(initialValues.time),
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  // Disable dates before today
  const disabledDate = (current: Dayjs) => {
    return current && current < dayjs().startOf("day");
  };

  // Disable times before the current time if today is selected
  const getDisabledTime = () => {
    if (selectedDate && dayjs(selectedDate).isSame(dayjs(), "day")) {
      const currentHour = dayjs().hour();
      const currentMinute = dayjs().minute();

      return {
        disabledHours: () =>
          [...Array(24).keys()].filter((hour) => hour < currentHour),
        disabledMinutes: (selectedHour: number) => {
          if (selectedHour === currentHour) {
            return [...Array(60).keys()].filter(
              (minute) => minute < currentMinute
            );
          }
          return [];
        },
      };
    }
    return {}; // No disabled times if a different date is selected
  };

  // Handle date change
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    if (menuError) {
      toast.error("Error fetching menu items");
    }

    if (workingHoursError) {
      toast.error("Error fetching working hours");
    }

    if (holidaysError) {
      toast.error("Error fetching holidays");
    }
  }, [menuError, workingHoursError, holidaysError]);

  return (
    <Modal
      forceRender
      centered
      title={initialValues ? "Edit Appointment" : "Add Appointment"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading || isWorkingHourLoading || isHolidayLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          date: dayjs(),
          time: dayjs(),
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name Field */}
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter your name" }]}
            className="mb-0"
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          {/* Number Field */}
          <Form.Item
            name="number"
            label="Number"
            validateDebounce={1200}
            rules={[
              { required: true, message: "Please enter your number" },
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject("");
                  } else if (!isValidPhoneNumber(value)) {
                    return Promise.reject("Please enter a valid number");
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <PhoneInput
              placeholder="Enter phone number"
              value={phoneValue}
              onChange={setPhoneValue}
              defaultCountry="IN" // Set default country code (e.g., +91 for India)
              className="custom-react-number-input border border-[#d9d9d9] w-full rounded-full px-2 h-[33px] hover:border-theme-primary focus:border-theme-primary"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Date Field */}
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
            className="mb-0"
          >
            <DatePicker
              className="w-full"
              disabledDate={disabledDate} // Disable past dates
              onChange={handleDateChange} // Update selected date
            />
          </Form.Item>

          {/* Time Field */}
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please select a time" }]}
          >
            <TimePicker
              format={"h:mm a"}
              className="w-full"
              disabledTime={getDisabledTime} // Disable times based on selected date
            />
          </Form.Item>
        </div>

        {/* Service Wanted (Multi-Select) */}
        <Form.Item
          name="services"
          label="Service Wanted"
          rules={[
            { required: true, message: "Please select at least one service" },
          ]}
        >
          <Select
            showSearch={true}
            loading={isMenuLoading}
            mode="multiple"
            placeholder="Select services"
            options={formatMenuItems(menuItems as TMenu[])}
            filterOption={(input, option) => {
              // `filterOption` for Ant Design Select
              // Convert input and text to lowercase for case-insensitive comparison
              const inputLower = input.toLowerCase();

              // Check if category title matches
              const categoryTitle = option?.title || "";
              const isTitleMatch = categoryTitle
                .toLowerCase()
                .includes(inputLower);

              // Check if subcategory (menu item) name matches
              const menuName =
                option?.label?.props?.children[0]?.props?.children || "";
              const isSubcategoryMatch = menuName
                .toLowerCase()
                .includes(inputLower);

              // Return true if either category title or subcategory name matches the input
              return isTitleMatch || isSubcategoryMatch;
            }}
          />
        </Form.Item>

        {/* Additional Message */}
        <Form.Item
          name="message"
          label="Any Other Message"
          rules={[
            { max: 500, message: "Message cannot exceed 500 characters" },
          ]}
        >
          <TextArea placeholder="Enter any additional message" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentModal;

function formatMenuItems(menuItems: TMenu[] | undefined | null) {
  // Ensure menuItems is a valid array before proceeding
  if (!menuItems || !Array.isArray(menuItems) || menuItems.length === 0) {
    return []; // Return an empty array if input is invalid
  }

  return Object.values(
    menuItems.reduce(
      (
        acc: Record<
          string,
          {
            label: JSX.Element;
            title: string;
            options: { label: JSX.Element; value: string }[];
          }
        >,
        item
      ) => {
        if (!acc[item.menuCategory]) {
          acc[item.menuCategory] = {
            label: <span>{toReadableString(item.menuCategory)}</span>,
            title: item.menuCategory,
            options: [],
          };
        }

        acc[item.menuCategory].options.push({
          label: (
            <div className="flex items-center justify-between me-2">
              <div>{item.menuName}</div>
              <div className="text-sm text-gray-400">
                {RUPEE_SYMBOL}
                {item.menuPrice}
              </div>
            </div>
          ),
          value: item._id,
        });

        return acc;
      },
      {}
    )
  );
}
