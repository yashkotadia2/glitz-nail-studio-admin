import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

export const isTimeOutsideWorkingHours = (time: string): boolean => {
  // Get start and end time from environment variables, default to fallback if not set
  const startTime = process.env.START_TIME || "09:00"; // Default start time: 9:00 AM
  const endTime = process.env.END_TIME || "18:00"; // Default end time: 6:00 PM

  // Convert the times to dayjs objects for comparison
  const workingStartTime = dayjs(startTime, "HH:mm");
  const workingEndTime = dayjs(endTime, "HH:mm");

  // Check if the time is outside the working hours (inclusive)
  return !dayjs(time).isBetween(
    workingStartTime,
    workingEndTime,
    "minute",
    "[]"
  );
};
