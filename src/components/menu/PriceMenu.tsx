"use client";
import React, { useEffect } from "react";
import Header from "../global/Header";
import usePanelStore from "@/zustand/usePanelStore";
import MenuModal from "./MenuModal";
import { TMenuWithoutId, TMenu } from "@/types/types";
import { useMutation, useQuery } from "@tanstack/react-query";

import { API_ROUTES } from "@/apis/apiRoutes";
import useAxiosAPI from "@/apis/useAxios";
import PageLoader from "../loaders/PageLoader";
import groupByCategory from "@/lib/groupByCategory";
import MenuCategories from "./MenuCategories";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import toast from "react-hot-toast";

const buttonText = {
  mobile: "",
  tablet: "Menu",
  laptop: "Add Menu",
  tv: "Add Menu",
};

const PriceMenu = () => {
  const deviceType = useScreenWidth();
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
      toast.success("Menu item added successfully");
      setIsMenuModalOpen(false);
      refetchMenu();
    },
    onError: () => {
      toast.error("Error adding menu item");
    },
  });

  const handleMenuClick = () => {
    setIsMenuModalOpen(true);
  };

  useEffect(() => {
    if (error) {
      toast.error("Error fetching menu items");
    }
  }, [error]);

  if (isMenuLoading) {
    return <PageLoader />;
  }

  return (
    <div>
      <Header
        title="Menu"
        buttonText={buttonText[deviceType]}
        onClick={handleMenuClick}
      />
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
