"use client";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { API_ROUTES } from "@/apis/apiRoutes";
import useAxiosAPI from "@/apis/useAxios";
import { TAppointment, TMenu } from "@/types/types"; // Adjust according to your types
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import AppointmentModal from "./AppointmentModal";
import dayjs from "dayjs";
import {
  ColumnType,
  TablePaginationConfig,
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from "antd/es/table/interface";
import { Table, Button, Tooltip, Popconfirm } from "antd";
import toast from "react-hot-toast";

// Define DataType as TAppointment
type DataType = TAppointment;
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import convertMinutesToReadableFormat from "@/lib/convertMinutesToReadableFormat";

dayjs.extend(isSameOrAfter);

const AppointmentsTable = () => {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [editData, setEditData] = useState<TAppointment | undefined>();
  const { getData, putData, deleteData } = useAxiosAPI();
  const [tableHeight, setTableHeight] = useState<number>(0); // Initial height
  // Default filter applied (show today and future dates)
  const [filteredInfo, setFilteredInfo] = useState({
    date: ["todayOrLater"],
  });

  // Update table height based on window resize
  const updateTableHeight = () => {
    if (typeof window !== "undefined") {
      setTableHeight(window.innerHeight - 120); // Calculate height as 100dvh - 120px
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      updateTableHeight(); // Set initial height
      window.addEventListener("resize", updateTableHeight); // Update height on window resize

      return () => {
        window.removeEventListener("resize", updateTableHeight); // Clean up the event listener
      };
    }
  }, []);

  // Fetch menu items using useQuery
  const {
    data: menuItems,
    error: menuError,
    isLoading: menuLoading,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: () => getData(API_ROUTES.MENU.GET_ALL),
  });

  // Fetch appointments using useQuery
  const {
    refetch: refetchAppointments,
    data: appointments,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: () => getData(API_ROUTES.APPOINTMENT.GET_ALL),
  });

  //delete appointment using useMutation
  const { mutate: deleteAppointment, isPending: isDeletingAppointment } =
    useMutation({
      mutationFn: (id: string) => deleteData(API_ROUTES.APPOINTMENT.DELETE, id),
      onSuccess: () => {
        toast.success("Appointment deleted successfully");
        refetchAppointments();
      },
      onError: (error) => {
        console.log("Error deleting appointment", error);
        toast.error("Error deleting appointment");
      },
    });

  //edit appointment using useMutation
  const { mutate: editAppointment, isPending: isEditingAppointment } =
    useMutation({
      mutationFn: (editData: { id: string; data: TAppointment }) =>
        putData(API_ROUTES.APPOINTMENT.EDIT, editData.id, editData.data),
      onSuccess: () => {
        toast.success("Appointment edited successfully");
        setIsAppointmentModalOpen(false);
        refetchAppointments();
      },
      onError: (error) => {
        console.log("Error editing appointment", error);
        toast.error("Error editing appointment");
      },
    });

  // Handle error if data fetching fails
  useEffect(() => {
    if (error) {
      console.log("Error fetching appointments", error);
      toast.error("Error fetching appointments");
    }
    if (menuError) {
      console.log("Error fetching menu items", menuError);
      toast.error("Error fetching menu items");
    }
  }, [error, menuError]);

  // Function to calculate the total price of services based on service IDs and menu items
  const getServicesTotal = (
    serviceIds: string[],
    menuItems: TMenu[]
  ): number => {
    console.log(serviceIds, menuItems);
    if (!menuItems || serviceIds?.length === 0) return 0;

    return serviceIds?.reduce((total, serviceId) => {
      const menuItem = menuItems.find((item: TMenu) => item._id === serviceId);
      if (menuItem) {
        return total + menuItem.menuPrice; // Assuming menuPrice is a number
      }
      return total;
    }, 0);
  };

  const getServicesDuration = (
    serviceIds: string[],
    menuItems: TMenu[]
  ): number => {
    if (!menuItems || serviceIds?.length === 0) return 0;

    return serviceIds?.reduce((duration, serviceId) => {
      const menuItem = menuItems.find((item: TMenu) => item._id === serviceId);
      if (menuItem) {
        return duration + menuItem.duration; // Assuming menuPrice is a number
      }
      return duration;
    }, 0);
  };

  // Map the service IDs to corresponding menu items' name and price
  const getServiceDetails = (serviceIds: string[], menuItems: TMenu[]) => {
    if (!menuItems) return { services: [], total: 0 };
    const services = serviceIds.map((serviceId) => {
      const menuItem = menuItems.find((item: TMenu) => item._id === serviceId);
      if (menuItem) {
        return {
          name: menuItem.menuName,
          price: menuItem.menuPrice,
        };
      }
      return { name: "Service not found", price: 0 };
    });

    // Calculate the total price
    const total = services.reduce((sum, service) => sum + service.price, 0);
    return { services, total };
  };

  // Handle Edit Action
  const handleEdit = (appointment: TAppointment) => {
    setEditData(appointment);
    setIsAppointmentModalOpen(true);
  };

  // Handle Delete Action
  const handleDelete = (id: string) => {
    deleteAppointment(id);
    // Implement your delete logic here (e.g., calling an API to delete the appointment)
  };

  // Columns definition for Ant Design Table
  const columns: ColumnType<TAppointment>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      minWidth: 60,
    },
    {
      title: "Phone",
      dataIndex: "number",
      key: "number",
      minWidth: 110,
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD MMM YYYY"),
      sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix(),
      defaultSortOrder: "ascend", // Sort in ascending order by default
      filters: [
        {
          text: "From Today",
          value: "todayOrLater",
        },
      ],
      filteredValue: filteredInfo.date || null,
      onFilter: (value, record) => {
        if (value === "todayOrLater") {
          return dayjs(record.date).isSameOrAfter(dayjs(), "day");
        }
        return true; // For "allDates", show all records
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (time: string) => dayjs(time).format("hh:mm a"),
    },
    {
      title: "Services",
      dataIndex: "services",
      key: "service",
      minWidth: 270,
      render: (serviceIds: string[]) => {
        const { services } = getServiceDetails(
          serviceIds,
          menuItems as TMenu[]
        );
        return services.map((service, index) => (
          <div key={index} className="flex items-center justify-between -mb-1">
            <div>{`${index + 1}. ${service.name}`}</div>
            <div className="ms-2 me-3">{`₹${service.price}`}</div>
          </div>
        ));
      },
    },
    {
      title: "Total",
      key: "total",
      render: (_: unknown, record: TAppointment) => {
        console.log("Record", record);
        const total = getServicesTotal(record.services, menuItems as TMenu[]);
        return `₹${total}`;
      },
      width: 80,
    },
    {
      title: "Duration",
      key: "duration",
      render: (_: unknown, record: TAppointment) => {
        console.log("Record", record);
        const totalDuration = getServicesDuration(
          record.services,
          menuItems as TMenu[]
        );
        return `${convertMinutesToReadableFormat(totalDuration)}`;
      },
      width: 90,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      width: 200,
      render: (message: string) => (
        <Tooltip trigger={["click"]} title={message}>
          <div className="line-clamp-1">{message || "-"}</div>
        </Tooltip>
      ),
    },
    {
      title: "Actions",
      fixed: "right",
      render: (_: unknown, record: TAppointment) => (
        <div>
          <Button
            type="default"
            onClick={() => handleEdit(record)}
            className="me-2"
            icon={<EditOutlined />}
          />

          <Popconfirm
            title="Are you sure you want to delete this appointment?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              // onClick={() => handleDelete(record._id)}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  // Handle table change event (sorting, filtering, pagination)
  const handleChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<DataType> | SorterResult<DataType>[],
    extra: TableCurrentDataSource<DataType>
  ) => {
    if (false) {
      console.log("Table change", pagination, filters, sorter, extra);
    }

    setFilteredInfo({
      date: (filters.date as string[]) || null,
    });
  };

  return (
    <>
      <Table
        size="small"
        loading={isLoading || menuLoading || isDeletingAppointment}
        columns={columns}
        onChange={handleChange}
        tableLayout="auto"
        dataSource={appointments as TAppointment[]}
        pagination={false}
        rowKey="_id" // Make sure your appointments data has a unique '_id' field
        scroll={{
          x: "max-content",
          y: tableHeight,
        }}
      />
      <AppointmentModal
        loading={isEditingAppointment}
        open={isAppointmentModalOpen}
        onCancel={() => setIsAppointmentModalOpen(false)} // Close the modal
        onSubmit={(data) => {
          if (editData?._id) {
            editAppointment({ id: editData._id, data });
          }
        }} // Close the modal
        initialValues={editData} // Initial values for the form
      />
    </>
  );
};

export default AppointmentsTable;
