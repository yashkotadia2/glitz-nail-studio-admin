import { API_ROUTES } from "@/apis/apiRoutes";
import useAxiosAPI from "@/apis/useAxios";
import { TMenu, TMenuWithoutId } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, message, Popconfirm } from "antd";
import React from "react";
import { TbPencil, TbTrash } from "react-icons/tb";
import PageLoader from "../loaders/PageLoader";
import MenuModal from "./MenuModal";

const MenuCard = ({ item }: { item: TMenu }) => {
  const [isMenuModalOpen, setIsMenuModalOpen] = React.useState(false);
  const queryClient = useQueryClient(); // Access the queryClient instance

  const { deleteData, putData } = useAxiosAPI();

  const { mutate: deleteMenu, isPending } = useMutation({
    mutationKey: ["deleteMenu", item._id],
    mutationFn: (id: string) => deleteData(API_ROUTES.MENU.DELETE, id),
    onSuccess: () => {
      refetchMenu();
    },
    onError: () => {
      message.error("Error deleting menu item!");
    },
  });

  const { mutate: editMenuItem, isPending: isEditing } = useMutation({
    mutationKey: ["addMenu"],
    mutationFn: (data: TMenuWithoutId) =>
      putData(API_ROUTES.MENU.EDIT, item?._id, data),
    onSuccess: () => {
      setIsMenuModalOpen(false);
      refetchMenu();
    },
    onError: () => {
      message.error("Error adding menu item");
    },
  });

  const refetchMenu = () => {
    queryClient.invalidateQueries({ queryKey: ["menu"] }); // Invalidate the "menu" query
  };

  const onDelete = (id: string) => {
    deleteMenu(id);
  };

  if (isPending) {
    return <PageLoader />;
  }

  return (
    <>
      <div className="min-w-64 max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a href="#">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {item.menuName}
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {item.menuDescription}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            ₹{item.menuPrice}
          </span>
          <div className="flex items-center gap-2">
            <Button
              icon={<TbPencil />}
              onClick={() => setIsMenuModalOpen(true)}
            />

            <Popconfirm
              placement="rightBottom"
              title={
                <div>
                  Are you sure to delete{" "}
                  <span className="font-semibold">{item.menuName}</span> from
                  menu?
                </div>
              }
              onConfirm={() => onDelete(item._id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<TbTrash />} />
            </Popconfirm>
          </div>
        </div>
      </div>
      <MenuModal
        isLoading={isEditing}
        open={isMenuModalOpen}
        initialValues={item}
        onCancel={() => setIsMenuModalOpen(false)}
        onSubmit={(values: TMenuWithoutId) => {
          editMenuItem(values);
        }}
      />
    </>
  );
};

export default MenuCard;
