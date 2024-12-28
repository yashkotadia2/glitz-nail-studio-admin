import React from "react";
import { GroupedCategory } from "@/types/types";
import MenuCategory from "./MenuCategory";
import { Empty } from "antd";

const MenuCategories = ({
  menuCategories,
}: {
  menuCategories: GroupedCategory[];
}) => {
  if (!menuCategories || menuCategories.length === 0) {
    return (
      <div className="w-full h-[calc(100dvh-80px)] flex items-center justify-center">
        <Empty description="No menu items found" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-80px)] overflow-auto flex flex-col gap-4">
      {menuCategories.map((menuCategory) => (
        <MenuCategory key={menuCategory.category} menuCategory={menuCategory} />
      ))}
    </div>
  );
};

export default MenuCategories;
