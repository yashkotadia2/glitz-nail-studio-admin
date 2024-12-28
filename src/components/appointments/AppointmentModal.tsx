import React from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  TimePicker,
  Select,
  Modal,
} from "antd";
import dayjs from "dayjs";
import { TAppointment } from "@/types/types";

const { TextArea } = Input;
const { Option } = Select;

const serviceOptions = [
  { label: "Nail Art", value: "nailArt" },
  { label: "Gel Polish", value: "gelPolish" },
  { label: "Extensions", value: "extensions" },
  { label: "Refill", value: "refill" },
  { label: "Removal", value: "removal" },
];

type AppointmentModalProps = {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  initialValues?: TAppointment;
};

const AppointmentModal = ({
  open,
  onCancel,
  onSubmit,
}: AppointmentModalProps) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: TAppointment) => {
    console.log("Form values:", values);
  };
  return (
    <div>
      <Modal
        centered
        title="Appointment"
        open={open}
        onCancel={onCancel}
        onOk={onSubmit}
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
          {/* Name Field */}
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter your name" }]}
          >
            <Input placeholder="Enter your name" />
          </Form.Item>

          {/* Number Field */}
          <Form.Item
            name="number"
            label="Number"
            rules={[
              { required: true, message: "Please enter your phone number" },
              { type: "number", message: "Please enter a valid number" },
            ]}
          >
            <InputNumber
              className="w-full"
              placeholder="Enter your phone number"
            />
          </Form.Item>

          {/* Date Field */}
          <Form.Item
            name="date"
            label="Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          {/* Time Field */}
          <Form.Item
            name="time"
            label="Time"
            rules={[{ required: true, message: "Please select a time" }]}
          >
            <TimePicker format={"h:mm a"} className="w-full" />
          </Form.Item>

          {/* Service Wanted (Multi-Select) */}
          <Form.Item
            name="service"
            label="Service Wanted"
            rules={[
              { required: true, message: "Please select at least one service" },
            ]}
          >
            <Select mode="multiple" placeholder="Select services">
              {serviceOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
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
        </Form>{" "}
      </Modal>
    </div>
  );
};

export default AppointmentModal;
