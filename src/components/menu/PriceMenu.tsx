"use client";
import React, { useEffect } from "react";
import Header from "../global/Header";
import usePanelStore from "@/zustand/usePanelStore";
import MenuModal from "./MenuModal";
import { TMenuWithoutId, TMenu } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";

import { API_ROUTES } from "@/apis/apiRoutes";
import useAxiosAPI from "@/apis/useAxios";
import { message } from "antd";
import PageLoader from "../loaders/PageLoader";
import groupByCategory from "@/lib/groupByCategory";
import MenuCategories from "./MenuCategories";

const PriceMenu = () => {
  const { getData, postData } = useAxiosAPI();

  const { isMenuModalOpen, setIsMenuModalOpen } = usePanelStore();

  const {
    refetch: refetchMenu,
    data: menuItems,
    error,
    isPending: isMenuLoading,
  } = useQuery({
    queryKey: ["menu"],
    queryFn: () => getData(API_ROUTES.MENU.GET_ALL),
  });

  const { mutate: addMenu, isPending: isAddingMenu } = useMutation({
    mutationKey: ["addMenu"],
    mutationFn: (data: TMenuWithoutId) => postData(API_ROUTES.MENU.ADD, data),
    onSuccess: () => {
      setIsMenuModalOpen(false);
      refetchMenu();
    },
    onError: () => {
      message.error("Error adding menu item");
    },
  });

  const handleMenuClick = () => {
    setIsMenuModalOpen(true);
  };

  useEffect(() => {
    if (error) {
      message.error("Error fetching menu items");
    }
  }, [error]);

  console.log("GroupedData:", groupByCategory(menuItems as TMenu[]));

  if (isMenuLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <Header title="Menu" buttonText="Add Menu" onClick={handleMenuClick} />
      <MenuCategories menuCategories={groupByCategory(menuItems as TMenu[])} />
      <MenuModal
        isLoading={isAddingMenu}
        open={isMenuModalOpen}
        onCancel={() => setIsMenuModalOpen(false)}
        onSubmit={(values: TMenuWithoutId) => {
          addMenu(values);
        }}
      />
    </div>
  );
};

export default PriceMenu;
