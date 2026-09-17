import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsApp(to, message) {
  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: to,
      body: message,
    });
    console.log(`✅ WhatsApp sent to ${to} (SID: ${response.sid})`);
    return true;
  } catch (error) {
    console.error('❌ WhatsApp error:', error.message);
    return false;
  }
}