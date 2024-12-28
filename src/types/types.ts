export type TAppointment = {
  id: string;
  name: string;
  phone: number;
  date: string;
  time: string;
  services: TMenu[];
  message?: string;
};

export type TMenuCategory = {
  id: string;
  label:
    | "Gel Polish"
    | "Nail Art"
    | "Extensions"
    | "Overlays & Refills"
    | "Removals";
  value: "gelPolish" | "nailArt" | "extensions" | "overlays" | "removals";
};

export type TMenu = {
  _id: string;
  menuName: string;
  menuPrice: number;
  menuCategory: TMenuCategory["value"];
  menuDescription?: string;
};

export type TMenuWithoutId = Omit<TMenu, "id">;

export type GroupedCategory = {
  category: string;
  menuItems: TMenu[];
};
