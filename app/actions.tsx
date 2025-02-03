"use server"

import { SLACK_CHANNELS } from "@/lib/constants"
import { botwise } from "@/services/botwise"

export const sendSlackMessage = async (message: string, channel: string) => {
  try {
    await botwise.chat.postMessage({
      channel,
      text: message,
    })
  } catch (error) {
    console.error(`ERROR/SEND_SLACK_MESSAGE: ${error}`)
  }
}

export async function subscribeToWaitlist(formData: FormData) {
  const email = formData.get("email")

  // validation
  if (!email || typeof email !== "string") {
    return { error: "ERROR/INVALID_EMAIL" }
  }

  try {
    sendSlackMessage(
      `\n\n------\n🎉 new waitlist signup!\n\n${email} just expressed interest in goodfit\n\n`,
      SLACK_CHANNELS["goodfit-alerts"]
    )
    return { success: true, message: "Thanks for joining our waitlist!" }
  } catch (error) {
    return { error: `ERROR/SUBSCRIBE_TO_WAITLIST/${error}` }
  }
}
