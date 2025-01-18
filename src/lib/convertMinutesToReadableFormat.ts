function convertMinutesToReadableFormat(minutes: number): string {
  if (minutes < 0) return "Invalid input"; // Handle invalid input

  const days: number = Math.floor(minutes / 1440); // 1 day = 1440 minutes
  const hours: number = Math.floor((minutes % 1440) / 60); // Remaining hours
  const remainingMinutes: number = minutes % 60; // Remaining minutes

  // Build the readable format
  let readableFormat: string = "";

  if (days > 0) {
    readableFormat += `${days} d`;
  }
  if (hours > 0) {
    readableFormat += ` ${hours} h`;
  }
  if (remainingMinutes > 0) {
    readableFormat += ` ${remainingMinutes} m`;
  }

  // If no days, hours, or minutes, return "0 minutes"
  if (!readableFormat) {
    readableFormat = "0 m";
  }

  return readableFormat.trim(); // Remove trailing spaces
}

export default convertMinutesToReadableFormat;
