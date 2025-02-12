import prisma from "@/app/utils/db";
import { requireUser } from "@/app/utils/hooks";
import { emailClient } from "@/app/utils/mailtrap";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ invoiceId: string }>;
  }
) {
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

    const sender = {
      email: "hello@demomailtrap.com",
      name: "Prashant saxena",
    };

    emailClient.send({
      from: sender,
      to: [{ email: "prasxhunter@gmail.com" }],
      template_uuid: "5617b5ca-f7f2-4585-a230-6c68f9616953",
      template_variables: {
        first_name: invoiceData.clientName,
        company_info_name: "Invo-sage",
        company_info_address: "Patel Nagar",
        company_info_city: "Patna",
        company_info_zip_code: "800020",
        company_info_country: "Bihar",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send Email reminder" },
      { status: 500 }
    );
  }
}
