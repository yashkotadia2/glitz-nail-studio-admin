function toReadableString(input: string): string {
  // Add a space before each uppercase letter and convert the result to lowercase
  const readable = input.replace(/([A-Z])/g, " $1").toLowerCase();

  // Capitalize the first letter of each word
  return readable.replace(/\b\w/g, (char) => char.toUpperCase());
}

export default toReadableString;
