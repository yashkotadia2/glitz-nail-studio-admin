import { TMenu } from "@/types/types";
import React from "react";
import MenuCard from "./MenuCard";

const MenuCards = ({ items }: { items: TMenu[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <MenuCard key={item._id} item={item} />
      ))}
    </div>
  );
};

export default MenuCards;
