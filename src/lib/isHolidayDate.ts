import Holiday from "@/models/holiday.model";

// Function to check if the provided date is a holiday
export const isHolidayDate = async (holidayDate: string): Promise<boolean> => {
  try {
    // Check if there's a matching holiday in the database
    const holidayExists = await Holiday.findOne({
      holidayDate,
    });

    // Return true if holiday exists, otherwise false
    return !!holidayExists;
  } catch (error) {
    console.error("Error checking holiday date:", error);
    return false;
  }
};
