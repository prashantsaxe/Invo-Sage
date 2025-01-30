import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
// import FormData from "form-data"; // form-data v4.0.1
// import Mailgun from "mailgun.js"; // mailgun.js v11.1.0
import { emailClient } from "../../../utils/mailgun";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
  // const mailgun = new Mailgun(FormData);
  // const mg = mailgun.client({
  //   username: "api",
  //   key: process.env.MAILGUN_API_KEY || "API_KEY",
  // });

  try {
    const session = await requireUser();
    const { invoiceId } = await params;

    const invoiceData = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        userId: session.user?.id,
      },
    });

    if (!invoiceData) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    await emailClient.messages.create("sandboxee9a06faaedb43efb42cdb9a3b5064b6.mailgun.org", {
      from: `Invoice Sender <${invoiceData.fromEmail}>`,
      to: [invoiceData.clientEmail],
      subject: `Invoice #${invoiceData.invoiceNumber}`,
      template: "new_invoice",
      "h:X-Mailgun-Variables": JSON.stringify({
        first_name: invoiceData.clientName,
        company_info_name: "Invo-sage",
        company_info_address: "North Patel Nagar",
        company_info_city: "Patna",
        company_info_zip_code: "800024",
        company_info_country: "India",
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error); // logs any error
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}