import React, { FC, useCallback, useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableMenuItem from "./SortableMenuItem"; // Ensure SortableMenuItem is properly implemented
import { TMenu } from "@/types/types";

import { useMutation } from "@tanstack/react-query";
import useAxiosAPI from "@/apis/useAxios";
import { API_ROUTES } from "@/apis/apiRoutes";
import { useQueryClient } from "@tanstack/react-query";
import { message } from "antd";

const MenuCards: FC<{ items: TMenu[] }> = ({ items: menuItems }) => {
  const queryClient = useQueryClient();
  const { putData } = useAxiosAPI();
  const [itemsState, setItemsState] = useState(menuItems);

  const { mutate: reorderMenu } = useMutation({
    mutationKey: ["reorderMenu"],
    mutationFn: (newOrder: string[]) =>
      putData(API_ROUTES.MENU.REORDER, null, { newOrder }),
    onError: () => {
      message.error("Error reordering menu items");
      queryClient.invalidateQueries({ queryKey: ["menu"] }); // This will trigger a refetch of the menu data
    },
  });

  // Sensors with minimum drag distance
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Minimum movement of 10 pixels to start drag
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10, // Same for touch devices
      },
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        setItemsState((items) => {
          const oldIndex = items.findIndex((item) => item._id === active.id);
          const newIndex = items.findIndex((item) => item._id === over!.id);

          // Update the state first
          const newItems = arrayMove(items, oldIndex, newIndex);

          // Call reorderMenu with the new order
          reorderMenu(newItems.map((item) => item._id));

          return newItems; // Return the reordered state
        });
      }
    },
    [reorderMenu]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter} // Use closestCenter strategy
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={itemsState.map((item) => item._id)}
        strategy={rectSortingStrategy} // Rectangular sorting strategy
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {itemsState.map((item) => (
            <SortableMenuItem key={item._id} id={item._id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default MenuCards;
