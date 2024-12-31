import React, { FC, useCallback } from "react";
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
import PageLoader from "@/components/loaders/PageLoader";

import { useMutation } from "@tanstack/react-query";
import useAxiosAPI from "@/apis/useAxios";
import { API_ROUTES } from "@/apis/apiRoutes";
import { useQueryClient } from "@tanstack/react-query";

const MenuCards: FC<{ items: TMenu[] }> = ({ items: menuItems }) => {
  const queryClient = useQueryClient();
  const { putData } = useAxiosAPI();

  const { mutate: reorderMenu, isPending } = useMutation({
    mutationKey: ["reorderMenu"],
    mutationFn: (newOrder: string[]) =>
      putData(API_ROUTES.MENU.REORDER, null, { newOrder }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu"] }); // This will trigger a refetch of the menu data
    },
    onError: () => {
      console.error("Error reordering menu items");
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
        const oldIndex = menuItems.findIndex((item) => item._id === active.id);
        const newIndex = menuItems.findIndex((item) => item._id === over!.id);
        const newOrderArray = arrayMove(menuItems, oldIndex, newIndex);

        reorderMenu(newOrderArray.map((item) => item._id));
      }
    },
    [menuItems, reorderMenu]
  );

  if (isPending) {
    return <PageLoader />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter} // Use closestCenter strategy
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={menuItems.map((item) => item._id)}
        strategy={rectSortingStrategy} // Rectangular sorting strategy
      >
        <div className="flex flex-wrap gap-2">
          {menuItems.map((item) => (
            <SortableMenuItem key={item._id} id={item._id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default MenuCards;
