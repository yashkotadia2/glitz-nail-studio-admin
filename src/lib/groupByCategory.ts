import { TMenu, GroupedCategory } from "@/types/types";

const groupByCategory = (data: TMenu[]): GroupedCategory[] => {
  return data?.reduce<GroupedCategory[]>((acc, item) => {
    const category = item.menuCategory;

    // Find if the category already exists in the accumulator
    const existingCategory = acc.find((group) => group.category === category);

    if (existingCategory) {
      // If category exists, push the current item to menuItems array
      existingCategory.menuItems.push(item);
    } else {
      // If category does not exist, create a new object for this category
      acc.push({
        category: category,
        menuItems: [item],
      });
    }

    return acc;
  }, []);
};

export default groupByCategory;
