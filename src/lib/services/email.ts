import { Resend } from "resend";

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendSelectionEmail(
  to: string,
  name: string,
  reference: string,
  activationToken?: string
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    const errorMsg = "RESEND_API_KEY is not configured in the environment.";
    console.error(`[EMAIL SERVICE ERROR] ${errorMsg}`);
    return { success: false, error: errorMsg };
  }

  try {
    const resend = new Resend(apiKey);

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const activationUrl = activationToken
      ? `${baseUrl}/student/activate?token=${activationToken}`
      : "";

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; color: #333;">
        <h2>Congratulations, ${name}!</h2>
        <p>
          We are thrilled to inform you that your application to the
          <strong>BJMCS Cyber Club</strong> has been carefully reviewed
          and you have been selected to join us.
        </p>

        <p><strong>Your Application Reference:</strong> ${reference}</p>

        <h3>What happens next?</h3>

        ${
          activationToken
            ? `<p>
                You can now activate your student account and access the portal:
                <br/><br/>
                <a href="${activationUrl}"
                   style="display:inline-block;padding:10px 18px;background-color:#0f172a;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:bold;">
                  Activate Your Account
                </a>
                <br/><br/>
                Or copy this link:
                <a href="${activationUrl}">${activationUrl}</a>
              </p>`
            : `<p>
                Please keep your reference number safe. We will contact you soon
                with further instructions regarding the upcoming student portal
                and club orientation activities.
              </p>`
        }

        <br/>
        <p>Welcome to the club!</p>
        <p>Best regards,<br/>BJMCS Cyber Club Team</p>
      </div>
    `;

    const textContent = `
Congratulations, ${name}!

We are thrilled to inform you that your application to the BJMCS Cyber Club has been carefully reviewed and you have been selected to join us.

Your Application Reference: ${reference}

What happens next?

${
  activationToken
    ? `You can now activate your student account and access the portal using the following link:

${activationUrl}`
    : `Please keep your reference number safe. We will contact you soon with further instructions regarding the upcoming student portal and club orientation activities.`
}

Welcome to the club!

Best regards,
BJMCS Cyber Club Team
    `.trim();

    const { data, error } = await resend.emails.send({
      from: "BJMCS Cyber Club <noreply@bjmcs-cyber.bbroot.com>",
      to,
      subject: "Congratulations! You have been selected for BJMCS Cyber Club",
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      console.error("[EMAIL SERVICE ERROR] Resend:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error: any) {
    console.error("[EMAIL SERVICE ERROR] Failed to send selection email:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred while sending email",
    };
  }
}
