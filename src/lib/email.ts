/* eslint-disable react-hooks/rules-of-hooks */
export const runtime = "nodejs";

import nodemailer from "nodemailer";
import { useAdmin } from "@/hooks/use-user";

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  const { admin } = await useAdmin();
  if (!admin) return null;

  const userCredential = admin.gmailSmtp || process.env.SMTP_EMAIL!;
  const passCredential = admin.appPasswordSmtp || process.env.SMTP_PASSWORD!;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userCredential,
      pass: passCredential,
    },
  });

  await transporter.sendMail({
    from: userCredential,
    to,
    subject,
    text,
    html, // ✅ allow HTML template
  });
}
