import React, { useEffect } from "react";
import { Form, Input, InputNumber, Select, Modal } from "antd";
import { TMenuWithoutId } from "@/types/types";
import menuCategories from "@/data/menuCategories";

const { TextArea } = Input;
const { Option } = Select;

type MenuModalProps = {
  isLoading: boolean;
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: TMenuWithoutId) => void;
  initialValues?: TMenuWithoutId;
};

const MenuModal = ({
  isLoading,
  open,
  onCancel,
  onSubmit,
  initialValues,
}: MenuModalProps) => {
  const [form] = Form.useForm(); // Correctly using Form.useForm()

  const handleSubmit = (values: TMenuWithoutId) => {
    onSubmit(values);
  };

  // Set initial values when the modal opens
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields(); // Reset fields if there are no initial values
    }
  }, [form, initialValues]);

  return (
    <Modal
      confirmLoading={isLoading} // Use confirmLoading instead of loading
      centered
      title={initialValues ? "Edit Menu" : "Add Menu"}
      open={open}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        form={form} // Ensure the form instance is passed here
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* Menu Name */}
        <Form.Item
          name="menuName"
          label="Menu Item Name"
          rules={[
            { required: true, message: "Please enter your menu item name" },
          ]}
        >
          <Input placeholder="Enter your menu item name" />
        </Form.Item>

        {/* Price */}
        <Form.Item
          name="menuPrice"
          label="Price (₹)"
          rules={[
            { required: true, message: "Please enter your price" },
            { type: "number", message: "Please enter a valid price" },
          ]}
        >
          <InputNumber
            controls={false}
            className="w-full"
            placeholder="Enter your price"
          />
        </Form.Item>

        {/* Category */}
        <Form.Item
          name="menuCategory"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select placeholder="Select a category" allowClear>
            {menuCategories.map((option) => (
              <Option key={option.id} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Description */}
        <Form.Item
          name="menuDescription"
          label="Description"
          rules={[
            { max: 500, message: "Message cannot exceed 500 characters" },
          ]}
        >
          <TextArea placeholder="Enter menu description" rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MenuModal;
