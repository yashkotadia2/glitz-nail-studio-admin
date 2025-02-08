import Appointment from "@/models/appointment.model";
import Menu from "@/models/menu.model";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const isAppointmentOverlapping = async (
  date: string,
  time: string,
  services: string[],
  id?: string
) => {
  try {
    // Parse the provided date and time to get the start time
    const { startDateTime, endDateTime } = await getStartAndEndTimes(
      date,
      time,
      services
    );

    // Find appointments on the same date
    const appointmentsOnSameDate = await Appointment.find({
      date: {
        $eq: dayjs(date).toDate(),
      },
      _id: id ? { $ne: id } : { $exists: true }, // Exclude the appointment if id is provided
    });

    console.log("Appointments on the same date:", appointmentsOnSameDate);

    // Loop through the filtered appointments to check for time overlap
    const overlappingArray = await Promise.all(
      appointmentsOnSameDate.map(async (appointment) => {
        // Get the start and end times of the existing appointment
        const { startDateTime: existingStart, endDateTime: existingEnd } =
          await getStartAndEndTimes(
            appointment.date,
            appointment.time,
            appointment.services
          );

        // Use dayjs to compare times
        const newStart = dayjs(startDateTime);
        const newEnd = dayjs(endDateTime);
        const existingStartTime = dayjs(existingStart);
        const existingEndTime = dayjs(existingEnd);

        console.log("Start and end times:", newStart, newEnd);
        console.log(
          "Existing start and end times:",
          existingStartTime,
          existingEndTime
        );

        return (
          newStart.isSameOrBefore(existingEndTime, "minute") &&
          newEnd.isSameOrAfter(existingStartTime, "minute")
        );

        // Check if the new appointment overlaps with the existing one
        // return (
        //   newStart.isBefore(existingEndTime) || // New appointment starts before the end of the existing one
        //   newEnd.isAfter(existingStartTime) || // New appointment ends after the start of the existing one
        //   (newStart.isBefore(existingStartTime) &&
        //     newEnd.isAfter(existingEndTime)) || // New appointment fully overlaps an existing appointment
        //   (newStart.isAfter(existingStartTime) &&
        //     newEnd.isBefore(existingEndTime)) // New appointment is fully enclosed by an existing appointment
        // );
      })
    );

    console.log("isOverlappingXX", overlappingArray);

    return overlappingArray.some((overlap) => overlap);
  } catch (error) {
    console.error("Error checking appointment overlap:", error);
    return false;
  }
};

const getStartAndEndTimes = async (
  date: string | Date,
  time: string | Date,
  services: string[]
) => {
  // Convert date and time to string format if they are Date objects
  const formattedDate =
    date instanceof Date
      ? dayjs.utc(date).format("YYYY-MM-DD")
      : date.split("T")[0];

  const formattedTime =
    time instanceof Date ? dayjs(time).format("HH:mm") : time.split("T")[1];

  // Combine the formatted date and time to get the start time
  const startDateTime = dayjs(`${formattedDate}T${formattedTime}`).toDate();

  // Fetch service durations from the database
  const selectedServices = await Menu.find({ _id: { $in: services } });

  // Calculate the total duration
  const totalDuration = selectedServices.reduce(
    (acc, service) => acc + service.duration,
    0
  );

  // Calculate the end time based on the start time and total duration
  const endDateTime = dayjs(startDateTime)
    .add(totalDuration, "minute")
    .toDate();

  return { startDateTime, endDateTime };
};
