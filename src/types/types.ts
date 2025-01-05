// APPOINTMENT TYPES
export type TAppointment = {
  _id: string;
  name: string;
  phone: number;
  date: string;
  time: string;
  services: string[];
  message?: string;
};

// MENU TYPES
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

// FLYER TYPES
export type TFlyer = {
  _id: string;
  fileName: string;
  fileUrl: string;
  fileKey: string;
  uploadDate: string;
};
