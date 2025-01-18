import React from "react";
import { API_ROUTES } from "@/apis/apiRoutes";
import useAxiosAPI from "@/apis/useAxios";
import { TMenu, TMenuWithoutId } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Popconfirm, Tooltip } from "antd";
import { TbPencil, TbTrash } from "react-icons/tb";
import MenuModal from "./MenuModal";
import RUPEE_SYMBOL from "@/lib/rupeeSymbol";
import toast from "react-hot-toast";

const MenuCard = ({ item }: { item: TMenu }) => {
  const [isMenuModalOpen, setIsMenuModalOpen] = React.useState(false);
  const queryClient = useQueryClient(); // Access the queryClient instance

  const { deleteData, putData } = useAxiosAPI();

  const { mutate: deleteMenu } = useMutation({
    mutationFn: (id: string) => deleteData(API_ROUTES.MENU.DELETE, id),
    onSuccess: () => {
      toast.success("Menu item deleted successfully");
      refetchMenu();
    },
    onError: () => {
      toast.error("Error deleting menu item");
    },
  });

  const { mutate: editMenuItem, isPending: isEditing } = useMutation({
    mutationFn: (data: TMenuWithoutId) =>
      putData(API_ROUTES.MENU.EDIT, item?._id, data),
    onSuccess: () => {
      toast.success("Menu item edited successfully");
      setIsMenuModalOpen(false);
      refetchMenu();
    },
    onError: () => {
      toast.error("Error editing menu item");
    },
  });

  const refetchMenu = () => {
    queryClient.invalidateQueries({ queryKey: ["menu"] }); // Invalidate the "menu" query
  };

  const onDelete = (id: string) => {
    deleteMenu(id);
  };

  return (
    <>
      <div
        title="Drag to reorder"
        className="flex flex-col w-full h-44 p-5 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg menu-card-wrapper transition"
      >
        <div className="line-clamp-1 mb-2 text-xl font-bold tracking-tight text-gray-900 w-full flex items-center justify-between">
          <Tooltip trigger={["click"]} title={item.menuName}>
            <div className="text-2xl line-clamp-1">{item.menuName}</div>
          </Tooltip>
          <div className="text-sm text-gray-500 font-semibold">
            {item.duration}&nbsp;mins
          </div>
        </div>
        <Tooltip trigger={["click"]} title={item.menuDescription}>
          <p className="mb-3 font-normal text-gray-700 line-clamp-2">
            {item.menuDescription}
          </p>
        </Tooltip>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xl font-semibold text-gray-900">
            {RUPEE_SYMBOL}
            {item.menuPrice}
          </span>
          <div className="flex items-center gap-2">
            <Button
              icon={<TbPencil />}
              onClick={() => setIsMenuModalOpen(true)}
            />

            <Popconfirm
              title="Are you sure you want to delete this menu item?"
              onConfirm={() => onDelete(item._id)}
              okText="Yes"
              cancelText="No"
              placement="left"
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
