import { Resend } from "resend";

function getAppBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("NEXT_PUBLIC_APP_URL is required in production. Set it in Vercel environment variables.");
  }

  return "http://localhost:3000";
}

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

    const baseUrl = getAppBaseUrl();

    const activationUrl = activationToken
      ? `${baseUrl}/student/activate?token=${activationToken}`
      : "";

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; color: #333;">
        <h2>Congratulations, ${name}!</h2>
        <p>
          We are thrilled to inform you that your application to the
          <strong>BGMCS Cyber Club</strong> has been carefully reviewed
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
        <p>Best regards,<br/>BGMCS Cyber Club Team</p>
      </div>
    `;

    const textContent = `
Congratulations, ${name}!

We are thrilled to inform you that your application to the BGMCS Cyber Club has been carefully reviewed and you have been selected to join us.

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
BGMCS Cyber Club Team
    `.trim();

    const { data, error } = await resend.emails.send({
      from: "BGMCS Cyber Club <noreply@bgmcs-cyber.bbroot.com>",
      to,
      subject: "Congratulations! You have been selected for BGMCS Cyber Club",
      text: textContent,
      html: htmlContent,
    });

    if (error) {
      console.error("[EMAIL SERVICE ERROR] Resend rejected the request", {
        to,
        from: "BGMCS Cyber Club <noreply@bgmcs-cyber.bbroot.com>",
        subject: "Congratulations! You have been selected for BGMCS Cyber Club",
        error,
        statusCode: (error as { statusCode?: number })?.statusCode,
        body: (error as { body?: unknown })?.body,
      });
      return { success: false, error: (error as { message?: string })?.message || "Resend rejected the email request." };
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

export async function sendApplicationUpdateEmail(
  to: string,
  name: string,
  reference: string
): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    const errorMsg = "RESEND_API_KEY is not configured in the environment.";
    console.error(`[EMAIL SERVICE ERROR] ${errorMsg}`);
    return { success: false, error: errorMsg };
  }

  try {
    const resend = new Resend(apiKey);
    const subject = "An update about your BGMCS Cyber Club application";
    const text = `Dear ${name},

Thank you for applying to the BGMCS Cyber Club. We appreciate the time and care you put into your application (reference: ${reference}).

After reviewing applications for this intake, we are unable to offer you a place at this time. The number of places is limited, and this decision is not a reflection of your potential or a failure. We encourage you to continue learning and to apply again in a future intake.

Thank you again for your interest in the BGMCS Cyber Club.

Best regards,
BGMCS Cyber Club Team`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; color: #333; line-height: 1.6;">
        <p>Dear ${name},</p>
        <p>Thank you for applying to the <strong>BGMCS Cyber Club</strong>. We appreciate the time and care you put into your application.</p>
        <p><strong>Application reference:</strong> ${reference}</p>
        <p>After reviewing applications for this intake, we are unable to offer you a place at this time. The number of places is limited, and this decision is not a reflection of your potential or a failure. We encourage you to continue learning and to apply again in a future intake.</p>
        <p>Thank you again for your interest in the BGMCS Cyber Club.</p>
        <p>Best regards,<br/>BGMCS Cyber Club Team</p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: "BGMCS Cyber Club <noreply@bgmcs-cyber.bbroot.com>",
      to,
      subject,
      text,
      html,
    });

    if (error) {
      console.error("[EMAIL SERVICE ERROR] Resend rejected the application update email", {
        to,
        subject,
        error,
        statusCode: (error as { statusCode?: number })?.statusCode,
        body: (error as { body?: unknown })?.body,
      });
      return { success: false, error: (error as { message?: string })?.message || "Resend rejected the email request." };
    }

    return { success: true, messageId: data?.id };
  } catch (error: unknown) {
    console.error("[EMAIL SERVICE ERROR] Failed to send application update email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred while sending email",
    };
  }
}
