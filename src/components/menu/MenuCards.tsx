import React, { FC, useState, useCallback, useEffect } from "react";
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

const MenuCards: FC<{ items: TMenu[] }> = ({ items: initialItems }) => {
  const [items, setItems] = useState(initialItems);

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

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item._id === active.id);
        const newIndex = items.findIndex((item) => item._id === over!.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter} // Use closestCenter strategy
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item._id)}
        strategy={rectSortingStrategy} // Rectangular sorting strategy
      >
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <SortableMenuItem key={item._id} id={item._id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default MenuCards;
