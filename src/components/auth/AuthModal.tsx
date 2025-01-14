import React from "react";
import { Modal, Form, InputNumber, Button } from "antd";

interface AuthModalProps {
  open: boolean;
  onCancel: () => void;
  onFinish: (values: { code: number }) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onCancel, onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      centered
      title="Enter Authentication Code"
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="auth_form" onFinish={onFinish}>
        <Form.Item
          name="code"
          label="Authentication Code"
          rules={[
            {
              required: true,
              message: "Please input the authentication code!",
            },
          ]}
        >
          <InputNumber controls={false} className="w-full" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AuthModal;
