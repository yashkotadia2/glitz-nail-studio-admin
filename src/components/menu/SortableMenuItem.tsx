import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MenuCard from "./MenuCard";
import { TMenu } from "@/types/types";

const SortableMenuItem = ({ id, item }: { id: string; item: TMenu }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      <MenuCard item={item} />
    </div>
  );
};

export default SortableMenuItem;
