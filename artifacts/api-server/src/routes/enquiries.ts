import { Router, type IRouter } from "express";
import { db, enquiriesTable, insertEnquirySchema } from "@workspace/db";
import { Resend } from "resend";

const router: IRouter = Router();

const NOTIFY_EMAIL = "info@nigerdeltainnovate.org";

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  return key ? new Resend(key) : null;
}

router.post("/enquiries", async (req, res) => {
  const parsed = insertEnquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid enquiry data", details: parsed.error.issues });
    return;
  }

  const data = parsed.data;
  const [enquiry] = await db.insert(enquiriesTable).values(data).returning();

  const resend = getResend();
  if (resend) {
    const isAdmissions = data.type === "admissions";
    const subject = isAdmissions
      ? `New enquiry: ${data.name} · ${data.programme ?? "Undecided"}`
      : `Diploma interest: ${data.name} · ${data.field ?? "Undecided"}`;

    const lines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone / WhatsApp: ${data.phone}`,
    ];

    if (isAdmissions) {
      lines.push(
        `Programme: ${data.programme ?? "—"}`,
        `Mode of study: ${data.mode ?? "—"}`,
        `Location: ${data.location ?? "—"}`,
        `Note: ${data.note ?? "—"}`,
      );
    } else {
      lines.push(
        `Field: ${data.field ?? "—"}`,
        `Current position: ${data.status ?? "—"}`,
      );
    }

    const fromAddress = process.env.RESEND_FROM_EMAIL ?? "NDI Registry <onboarding@resend.dev>";

    await resend.emails.send({
      from: fromAddress,
      to: NOTIFY_EMAIL,
      subject,
      text: lines.join("\n"),
    });
  }

  res.status(201).json(enquiry);
});

export default router;
