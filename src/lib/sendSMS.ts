import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

/**
 * Function to send an SMS using Twilio
 * @param to - The recipient phone number
 * @param messageBody - The body of the message
 * @returns - Promise with the message SID or an error message
 */
export const sendSMS = async (
  to: string,
  messageBody: string
): Promise<string> => {
  try {
    const message = await client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER, // Replace with your Twilio phone number
      to: `${to}`,
    });
    return message.sid;
  } catch (error: unknown) {
    console.log("Failed to send SMS:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to send SMS: ${error.message}`);
    } else {
      throw new Error("Failed to send SMS due to an unknown error");
    }
  }
};
