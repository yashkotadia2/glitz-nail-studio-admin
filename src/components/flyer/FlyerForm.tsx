import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload, Form, Button, message } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { useMutation } from "@tanstack/react-query";
import useAxiosAPI from "@/apis/useAxios";
import { API_ROUTES } from "@/apis/apiRoutes";
import PageLoader from "../loaders/PageLoader";
import { useQueryClient } from "@tanstack/react-query";
import imageCompression from "browser-image-compression";

type UploadChangeParam = {
  file: UploadFile;
  fileList: UploadFile[];
  event?: ProgressEvent;
};

const normFile = (e: UploadChangeParam) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const { Dragger } = Upload;

const FlyerForm = () => {
  const [isCompressing, setIsCompressing] = useState(false);
  const queryClient = useQueryClient();
  const { putData } = useAxiosAPI();

  const { mutate: uploadFlyer, isPending } = useMutation({
    mutationKey: ["uploadFlyer"],
    mutationFn: (file: UploadFile) => {
      console.log("Uploading file:", file);
      const formData = new FormData();
      if (file.originFileObj) {
        formData.append("fileName", file.name);
        formData.append("file", file.originFileObj as Blob);
      }
      return putData(API_ROUTES.FLYER.UPLOAD, null, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flyerImages"] });
    },
    onError: () => {
      alert("File upload failed!");
    },
  });

  const handleBeforeUpload = async (file: File) => {
    // Compression options
    const options = {
      maxSizeMB: 1, // Max file size (1 MB)
      maxWidthOrHeight: 1920, // Max width/height
      useWebWorker: true,
    };

    try {
      setIsCompressing(true);
      // Compress the image
      const compressedFile = await imageCompression(file, options);

      // Return the compressed file as a File object
      return new File([compressedFile], file.name, { type: file.type });
    } catch {
      message.error("Image compression failed!");
      return Upload.LIST_IGNORE;
    } finally {
      setIsCompressing(false);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    listType: "picture",
    multiple: false,
    maxCount: 1,
    accept: ".jpg,.jpeg,.png", //images only
    beforeUpload: handleBeforeUpload, // Compress before uploading
    onChange(info) {
      const { file } = info;
      file.status = "done"; // Simulate successful upload for Ant Design UI
    },
  };

  const onFinish = (values: { upload: UploadFile[] }) => {
    console.log("Form submitted with values:", values);
    uploadFlyer(values.upload[0]);
  };

  if (isPending) {
    return (
      <div className="w-full h-[calc(100dvh-75px)]">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      {/* Ant Design Form */}
      <Form
        name="flyerForm"
        onFinish={onFinish}
        layout="vertical"
        className="relative"
      >
        <Form.Item
          name="upload"
          label="Upload Files"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            { required: true, message: "Please upload at least one file!" },
          ]}
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag image to this area to upload
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item className="absolute -top-1 right-0">
          <Button
            loading={isCompressing}
            size="small"
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default FlyerForm;
