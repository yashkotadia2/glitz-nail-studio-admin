import React, { useEffect } from "react";
import { Form, Input, DatePicker, Modal } from "antd";
import dayjs from "dayjs";
import { THoliday } from "@/types/types";

type HolidayModalProps = {
  loading: boolean;
  open: boolean;
  onCancel: () => void;
  onSubmit: (data: THoliday) => void;
  initialValues?: THoliday;
};

const HolidayModal: React.FC<HolidayModalProps> = ({
  loading,
  open,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Handle form submission
  const handleSubmit = (values: THoliday) => {
    onSubmit(values);
  };

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        ...initialValues,
        holidayDate: dayjs(initialValues.holidayDate),
      });
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Modal
      forceRender
      centered
      title={initialValues ? "Edit Holiday" : "Add Holiday"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          holidayDate: dayjs(),
        }}
      >
        {/* Holiday Name Field */}
        <Form.Item
          name="holidayName"
          label="Holiday Name"
          rules={[{ required: true, message: "Please enter the holiday name" }]}
        >
          <Input placeholder="Enter holiday name" />
        </Form.Item>

        {/* Holiday Date Field */}
        <Form.Item
          name="holidayDate"
          label="Holiday Date"
          rules={[
            { required: true, message: "Please select the holiday date" },
          ]}
        >
          <DatePicker className="w-full" />
        </Form.Item>

        {/* Description Field */}
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { max: 500, message: "Description cannot exceed 500 characters" },
          ]}
        >
          <Input.TextArea placeholder="Enter holiday description" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HolidayModal;
