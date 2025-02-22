import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);

export const isTimeOutsideWorkingHours = (time: string): boolean => {
  // Get start and end time from environment variables, default to fallback if not set
  const startTime = process.env.START_TIME || "09:00"; // Default start time: 9:00 AM
  const endTime = process.env.END_TIME || "18:00"; // Default end time: 6:00 PM

  // Convert the times to dayjs objects for comparison
  const workingStartTime = dayjs(startTime, "HH:mm");
  const workingEndTime = dayjs(endTime, "HH:mm");

  // Extract time part from the input and append today's date
  const inputTime = time.split("T")[1];
  const today = dayjs().format("YYYY-MM-DD"); // Get today's date in YYYY-MM-DD format
  const todayWithTime = dayjs(`${today}T${inputTime}`); // Combine today's date with extracted time

  // Check if the time is outside the working hours (inclusive)
  return !todayWithTime.isBetween(
    workingStartTime,
    workingEndTime,
    "minute",
    "[]"
  );
};
