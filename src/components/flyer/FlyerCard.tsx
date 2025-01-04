import { TFlyer } from "@/types/types";
import { Image, Popconfirm } from "antd";
import React from "react";
import dayjs from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";
import { useMutation } from "@tanstack/react-query";
import useAxiosAPI from "@/apis/useAxios";
import { API_ROUTES } from "@/apis/apiRoutes";
import PageLoader from "../loaders/PageLoader";
import { useQueryClient } from "@tanstack/react-query";

const FlyerCard = ({ flyer }: { flyer: TFlyer }) => {
  const queryClient = useQueryClient();
  const { deleteData } = useAxiosAPI();
  const { mutate: deleteFlyer, isPending } = useMutation({
    mutationKey: ["deleteFlyer", flyer._id],
    mutationFn: (id: string) => {
      return deleteData(API_ROUTES.FLYER.DELETE, id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flyerImages"] });
    },
  });

  if (isPending) {
    return (
      <div className="w-full h-64">
        <PageLoader />
      </div>
    );
  }

  return (
    <div className="p-3 bg-theme-primary/10 rounded-lg h-fit">
      <Image
        height={200}
        src={flyer.fileUrl}
        alt={flyer.fileName}
        className="object-cover bg-center rounded-md"
      />
      <div className="flex justify-between items-center">
        <div>
          <div className="text-md font-semibold leading-4 line-clamp-2">
            {flyer.fileName}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {dayjs(flyer.uploadDate).format("DD MMM YYYY hh:mm a")}
          </div>
        </div>
        <div>
          <button className="btn btn-danger">
            <Popconfirm
              title={`Are you to delete ${flyer.fileName}?`}
              onConfirm={() => {
                deleteFlyer(flyer._id);
              }}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <DeleteOutlined className="text-red-500 text-xl px-2" />
            </Popconfirm>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlyerCard;
