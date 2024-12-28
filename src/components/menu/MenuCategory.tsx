import React from "react";
import { GroupedCategory, TMenuCategory } from "@/types/types";
import MenuCards from "./MenuCards";
import menuCategories from "@/data/menuCategories";

const MenuCategory = ({ menuCategory }: { menuCategory: GroupedCategory }) => {
  return (
    <div>
      <div className="text-2xl font-light mb-2">
        {
          menuCategories.find(
            (category: TMenuCategory) =>
              category.value === menuCategory.category
          )?.label
        }
      </div>
      <MenuCards items={menuCategory?.menuItems} />
    </div>
  );
};

export default MenuCategory;
