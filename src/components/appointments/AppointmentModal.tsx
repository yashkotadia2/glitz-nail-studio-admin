import React, { JSX, useEffect, useState } from "react";
import { Form, Input, DatePicker, TimePicker, Select, Modal } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { TAppointment, TMenu, THoliday } from "@/types/types";
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

  // Fetch appointments using useQuery
  const {
    data: appointments,
    error: appointmentsError,
    isPending: isAppointmentsLoading,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => getData(API_ROUTES.APPOINTMENT.GET_ALL),
  });

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
  } = useQuery<{
    startTime: string;
    endTime: string;
  }>({
    queryKey: ["working-hours"],
    queryFn: () => getData(API_ROUTES.WORKING_HOURS.GET),
  });

  const {
    data: holidays,
    isPending: isHolidayLoading,
    error: holidaysError,
  } = useQuery<{
    holidays: THoliday[];
  }>({
    queryKey: ["holidays"],
    queryFn: () => getData(API_ROUTES.HOLIDAY.GET_ALL),
  });

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

  // Disable dates before today and holidays
  const disabledDate = (current: Dayjs) => {
    if (!current) return false;

    // Disable past dates
    const isPastDate = current < dayjs().startOf("day");

    // Disable holidays
    const isHoliday =
      Array.isArray(holidays) &&
      holidays.some((holiday: THoliday) =>
        dayjs(holiday.holidayDate).isSame(current, "day")
      );

    return isPastDate || isHoliday;
  };

  // Disable times outside of working hours and before the current time (for today)
  const getDisabledTime = () => {
    const startTime = dayjs(workingHours?.startTime, "HH:mm");
    const endTime = dayjs(workingHours?.endTime, "HH:mm");

    const selectedDatesAppointment: TAppointment[] = Array.isArray(appointments)
      ? appointments.filter((appointment: TAppointment) => {
          return dayjs(appointment.date).isSame(selectedDate, "day");
        })
      : [];

    const disabledHoursLet: number[] = [];
    const disabledMinutesLet: { [key: number]: number[] } = {};

    // Disable hours/minutes based on today's appointments (applies to any day)
    selectedDatesAppointment.forEach((appointment) => {
      const appointmentStartTime = dayjs(appointment.time);
      const totalServiceDuration = appointment.services.reduce(
        (totalDuration, serviceId) => {
          const service = (menuItems as TMenu[]).find(
            (item) => item._id === serviceId
          );
          return totalDuration + (service?.duration || 0);
        },
        0
      );
      const appointmentEndTime = appointmentStartTime.add(
        totalServiceDuration,
        "minute"
      );

      // Disable hours and minutes within the appointment range
      for (
        let hour = appointmentStartTime.hour();
        hour <= appointmentEndTime.hour();
        hour++
      ) {
        // If the appointment starts and ends within the same hour
        if (appointmentStartTime.hour() === appointmentEndTime.hour()) {
          // Disable minutes between the start and end time within the same hour
          disabledMinutesLet[hour] = [...Array(60).keys()].filter(
            (minute) =>
              minute >= appointmentStartTime.minute() &&
              minute <= appointmentEndTime.minute()
          );
        } else {
          // Disable minutes for the start hour
          if (hour === appointmentStartTime.hour()) {
            disabledHoursLet.push(hour);
            disabledMinutesLet[hour] = [...Array(60).keys()].filter(
              (minute) => minute >= appointmentStartTime.minute()
            );
          }

          // Disable minutes for the end hour
          if (hour === appointmentEndTime.hour()) {
            disabledMinutesLet[hour] = [...Array(60).keys()].filter(
              (minute) => minute <= appointmentEndTime.minute()
            );
          }

          // Disable the entire hour if it's a full hour between start and end time
          if (
            hour > appointmentStartTime.hour() &&
            hour < appointmentEndTime.hour()
          ) {
            if (!disabledHoursLet.includes(hour)) {
              disabledHoursLet.push(hour);
            }
            disabledMinutesLet[hour] = [...Array(60).keys()]; // Disable all minutes for full hours in between
          }
        }
      }

      // Output disabled hours and minutes
      return {
        disabledHoursLet,
        disabledMinutesLet,
      };
    });

    // If today is selected, disable times before the current time
    if (selectedDate && dayjs(selectedDate).isSame(dayjs(), "day")) {
      const currentHour = dayjs().hour() + 1;
      const currentMinute = dayjs().minute();

      return {
        disabledHours: () => {
          // Disable hours outside working hours and before current time
          return [
            ...[...Array(24).keys()].filter(
              (hour) =>
                hour < startTime.hour() ||
                hour > endTime.hour() ||
                hour < currentHour
            ),
            ...disabledHoursLet,
          ];
        },
        disabledMinutes: (selectedHour: number) => {
          // Get disabled minutes based on the appointment for the selected hour
          const disabledMinutesFromAppointments =
            disabledMinutesLet[selectedHour] || [];

          // Disable minutes before the current minute for the current hour (only for today)
          if (selectedDate && dayjs(selectedDate).isSame(dayjs(), "day")) {
            if (selectedHour === currentHour) {
              return [
                ...new Set([
                  ...[...Array(60).keys()].filter(
                    (minute) => minute < currentMinute
                  ),
                  ...disabledMinutesFromAppointments,
                ]),
              ]; // Merge and remove duplicates
            }
          }

          // Disable all minutes except 0 when selectedHour is equal to endTime.hour()
          if (selectedHour === endTime.hour()) {
            return [
              ...new Set([
                ...[...Array(60).keys()].filter((minute) => minute !== 0),
                ...disabledMinutesFromAppointments,
              ]),
            ]; // Merge and remove duplicates
          }

          // Return the disabled minutes from appointments if not today
          return disabledMinutesFromAppointments;
        },
      };
    }

    // Disable times outside working hours for other days and add disabled hours/minutes from selected date's appointments
    return {
      disabledHours: () => {
        return [
          ...[...Array(24).keys()].filter(
            (hour) => hour < startTime.hour() || hour > endTime.hour()
          ),
          ...disabledHoursLet, // Append another array
        ];
      },
      disabledMinutes: (selectedHour: number) => {
        // Disable all minutes except 0 when selectedHour is equal to endTime.hour() for any day
        if (selectedHour === endTime.hour()) {
          disabledMinutesLet[selectedHour] = [
            ...[...Array(60).keys()].filter((minute) => minute !== 0), // Original disabled minutes
          ];
        }
        return disabledMinutesLet[selectedHour] || [];
      },
    };
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

    if (appointmentsError) {
      toast.error("Error fetching appointments");
    }
  }, [menuError, workingHoursError, holidaysError, appointmentsError]);

  return (
    <Modal
      forceRender
      centered
      title={initialValues ? "Edit Appointment" : "Add Appointment"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={
        loading ||
        isWorkingHourLoading ||
        isHolidayLoading ||
        isAppointmentsLoading
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          name: "Yash Kotadia",
          number: "+919979972183",
          services: ["678b61a087b0d8038981fd86"],
          date: null,
          time: null,
          message: "xxydk",
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
              // disabledDate={disabledDate}

              // Disable past dates
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
              showNow={false}
              format={"h:mm a"}
              className="w-full"
              // disabledTime={getDisabledTime}

              // Disable times based on selected date
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
