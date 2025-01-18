// TWILIO SMS RESPONSE TYPES
export type TTwilioMessageResponse = {
  account_sid: string;
  api_version: string;
  body: string;
  date_created: string;
  date_sent: string | null;
  date_updated: string;
  direction: string;
  error_code: number | null;
  error_message: string | null;
  from: string;
  messaging_service_sid: string | null;
  num_media: string;
  num_segments: string;
  price: string | null;
  price_unit: string;
  sid: string;
  status: string;
  subresource_uris: {
    media: string;
  };
  to: string;
  uri: string;
};

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
  duration: number;
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

// HOLIDAY TYPES
export type THoliday = {
  _id: string;
  holidayName: string;
  holidayDate: string;
  description: string;
};
