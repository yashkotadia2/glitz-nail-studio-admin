// import dayjs from "dayjs";
// import isBetween from "dayjs/plugin/isBetween";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import timezone from "dayjs/plugin/timezone";

// dayjs.extend(isBetween);
// dayjs.extend(customParseFormat);
// dayjs.extend(timezone);

// export const isTimeOutsideWorkingHours = (time: string): boolean => {
//   // Get start and end time from environment variables, default to fallback if not set
//   const startTime = process.env.START_TIME || "09:00"; // Default start time: 9:00 AM
//   const endTime = process.env.END_TIME || "18:00"; // Default end time: 6:00 PM

//   // Convert the times to dayjs objects for comparison
//   const workingStartTime = dayjs(startTime, "HH:mm");
//   const workingEndTime = dayjs(endTime, "HH:mm");

//   // Extract time part from the input and append today's date
//   const inputTime = time.split("T")[1];
//   const today = dayjs().format("YYYY-MM-DD"); // Get today's date in YYYY-MM-DD format

//   // Conditionally apply timezone conversion based on server's time zone
//   let todayWithTime;
//   if (dayjs.tz.guess() !== "Asia/Kolkata") {
//     console.log("IF");
//     todayWithTime = dayjs(`${today}T${inputTime}`).tz("Asia/Kolkata"); // Convert to Asia/Kolkata
//   } else {
//     console.log("ELSE");
//     todayWithTime = dayjs(`${today}T${inputTime}`); // No conversion
//   }
//   console.log(
//     "ABCDEFGH",
//     dayjs.tz.guess(),
//     time,
//     todayWithTime,
//     startTime,
//     workingStartTime,
//     endTime,
//     workingEndTime
//   );

//   // Check if the time is outside the working hours (inclusive)
//   return !todayWithTime.isBetween(
//     workingStartTime,
//     workingEndTime,
//     "minute",
//     "[]"
//   );
// };

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

  // Extract time part from the input and append today's date
  const inputTime = time.split("T")[1];
  const today = dayjs().format("YYYY-MM-DD"); // Get today's date in YYYY-MM-DD format

  // Get the server's time zone
  const serverTimeZone = dayjs.tz.guess();

  // Initialize the working times
  let workingStartTime = dayjs(startTime, "HH:mm");
  let workingEndTime = dayjs(endTime, "HH:mm");
  let todayWithTime;

  // Conditionally apply timezone conversion based on server's time zone
  if (serverTimeZone !== "Asia/Calcutta") {
    todayWithTime = dayjs(`${today}T${inputTime}`).tz("Asia/Kolkata"); // Convert input time to Asia/Kolkata
    // Instead of combining with today's date, just apply the time zone to start and end time
    workingStartTime = dayjs.tz(startTime, "HH:mm", "Asia/Kolkata");
    workingEndTime = dayjs.tz(endTime, "HH:mm", "Asia/Kolkata");
  } else {
    todayWithTime = dayjs(`${today}T${inputTime}`); // No conversion
    workingStartTime = dayjs(startTime, "HH:mm"); // No conversion
    workingEndTime = dayjs(endTime, "HH:mm"); // No conversion
  }

  // Check if the time is outside the working hours (inclusive)
  return !todayWithTime.isBetween(
    workingStartTime,
    workingEndTime,
    "minute",
    "[]"
  );
};
