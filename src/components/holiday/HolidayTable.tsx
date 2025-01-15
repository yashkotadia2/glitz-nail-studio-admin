import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Table, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { THoliday } from "../../types/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxiosAPI from "@/apis/useAxios";
import { API_ROUTES } from "@/apis/apiRoutes";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import HolidayModal from "./HolidayModal";

const HolidayTable: React.FC = () => {
  const [tableHeight, setTableHeight] = useState<number>(0); // Initial height
  const [isHolidayModalOpen, setIsHolidayModalOpen] = useState<boolean>(false); // Modal state
  const [editData, setEditData] = useState<THoliday | undefined>();

  // Define columns for the Ant Design Table
  const columns: ColumnsType<THoliday> = [
    {
      title: "Holiday Name",
      dataIndex: "holidayName",
      key: "holidayName",
    },
    {
      title: "Holiday Date",
      dataIndex: "holidayDate",
      key: "holidayDate",
      render: (text: string) => dayjs(text).format("DD MMM YYYY"), // Format the date
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
      render: (_: unknown, record: THoliday) => (
        <div>
          <Button
            type="default"
            onClick={() => handleEdit(record)}
            className="me-2"
            icon={<EditOutlined />}
          />

          <Popconfirm
            title="Are you sure you want to delete this holiday?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const { getData, deleteData, putData } = useAxiosAPI();

  const {
    data: holidays,
    isPending,
    error,
    refetch: refetchHolidays,
  } = useQuery({
    queryKey: ["holidays"],
    queryFn: () => getData(API_ROUTES.HOLIDAY.GET_ALL),
  });

  const { mutate: editHoliday, isPending: isEditingAppointment } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: THoliday }) =>
      putData(API_ROUTES.HOLIDAY.EDIT, id, data),
    onSuccess: () => {
      refetchHolidays();
      toast.success("Holiday updated successfully");
      setIsHolidayModalOpen(false);
    },
    onError: () => {
      toast.error("Failed to update holiday");
    },
  });

  const { mutate: deleteHoliday, isPending: isDeletingHoliday } = useMutation({
    mutationFn: (id: string) => deleteData(API_ROUTES.HOLIDAY.DELETE, id),
    onSuccess: () => {
      refetchHolidays();
      toast.success("Holiday deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete holiday");
    },
  });

  // Handle Edit Action
  const handleEdit = (holiday: THoliday) => {
    setEditData(holiday);
    setIsHolidayModalOpen(true);
  };

  // Handle Delete Action
  const handleDelete = (id: string) => {
    deleteHoliday(id);
  };

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

  if (error) {
    toast.error("Failed to fetch holidays");
  }

  return (
    <>
      <Table
        loading={isPending || isEditingAppointment || isDeletingHoliday}
        columns={columns}
        dataSource={holidays as THoliday[]}
        rowKey="_id"
        size="small"
        tableLayout="auto"
        pagination={false}
        scroll={{
          x: "max-content",
          y: tableHeight,
        }}
      />
      <HolidayModal
        loading={isEditingAppointment}
        open={isHolidayModalOpen}
        onCancel={() => setIsHolidayModalOpen(false)} // Close the modal
        onSubmit={(data) => {
          if (editData?._id) {
            editHoliday({ id: editData._id, data });
          }
        }} // Close the modal
        initialValues={editData} // Initial values for the form
      />
    </>
  );
};

export default HolidayTable;
