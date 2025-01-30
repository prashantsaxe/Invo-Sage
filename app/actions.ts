"use server";

import { requireUser } from "./utils/hooks";
import { parseWithZod } from "@conform-to/zod";
import { invoiceSchema, onboardingSchema } from "./utils/zodSchemas";
import prisma from "./utils/db";
import { redirect } from "next/navigation";
import { emailClient } from "./utils/mailgun";
import { formatCurrency } from "./utils/formatCurrency";
// import FormData from "form-data";
import Mailgun from "mailgun.js";


export async function onboardUser(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: onboardingSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      firstName: submission.value.firstName,
      lastName: submission.value.lastName,
      address: submission.value.address,
    },
  });

  return redirect("/dashboard");
}

export async function createInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.create({
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
      userId: session.user?.id,
    },
  });

  // // **Mailgun Setup**
  // const mailgun = new Mailgun(FormData);
  // const mg = mailgun.client({
  //   username: "api",
  //   key: process.env.API_KEY || "API_KEY",
  // });

  const sandboxDomain = "sandboxee9a06faaedb43efb42cdb9a3b5064b6.mailgun.org"; // Your Mailgun sandbox domain

  try {
    await emailClient.messages.create(sandboxDomain, {
      from: `Mailgun Sandbox <postmaster@${sandboxDomain}>`,
      to: ["xhunter <prasxhunter@gmail.com>"], // Replace with recipient email
      subject: `Invoice #${submission.value.invoiceNumber}`,
      template: "new invoice", // Make sure this template exists in Mailgun
      "h:X-Mailgun-Variables": JSON.stringify({
        clientName: submission.value.clientName,
        invoiceNumber: submission.value.invoiceNumber,
        invoiceDueDate: new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(new Date(submission.value.dueDate)),
        invoiceAmount: formatCurrency({
          amount: submission.value.total,
          currency: submission.value.currency as any,
        }),
        invoiceLink:
          process.env.NODE_ENV !== "production"
            ? `http://localhost:3000/api/invoice/${data.id}`
            : `https://invo-sage.vercel.app/api/invoice/${data.id}`,
      }),
    });

    console.log("Invoice email sent successfully via Mailgun Sandbox.");
  } catch (error) {
    console.error("Mailgun Error:", error);
  }

  return redirect("/dashboard/invoices");
}

export async function editInvoice(prevState: any, formData: FormData) {
  const session = await requireUser();

  const submission = parseWithZod(formData, {
    schema: invoiceSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const data = await prisma.invoice.update({
    where: {
      id: formData.get("id") as string,
      userId: session.user?.id,
    },
    data: {
      clientAddress: submission.value.clientAddress,
      clientEmail: submission.value.clientEmail,
      clientName: submission.value.clientName,
      currency: submission.value.currency,
      date: submission.value.date,
      dueDate: submission.value.dueDate,
      fromAddress: submission.value.fromAddress,
      fromEmail: submission.value.fromEmail,
      fromName: submission.value.fromName,
      invoiceItemDescription: submission.value.invoiceItemDescription,
      invoiceItemQuantity: submission.value.invoiceItemQuantity,
      invoiceItemRate: submission.value.invoiceItemRate,
      invoiceName: submission.value.invoiceName,
      invoiceNumber: submission.value.invoiceNumber,
      status: submission.value.status,
      total: submission.value.total,
      note: submission.value.note,
    },
  });

  // **Mailgun Setup**
  // const mailgun = new Mailgun(FormData);
  // const mg = mailgun.client({
  //   username: "api",
  //   key: process.env.API_KEY || "API_KEY",
  // });

  const sandboxDomain = "sandboxee9a06faaedb43efb42cdb9a3b5064b6.mailgun.org"; // Mailgun sandbox domain

  try {
    await emailClient.messages.create(sandboxDomain, {
      from: `Mailgun Sandbox <postmaster@${sandboxDomain}>`,
      to: ["xhunter <prasxhunter@gmail.com>"],
      subject: `Invoice Updated - #${submission.value.invoiceNumber}`,
      template: "edit invoice", // Ensure this template exists in Mailgun
      "h:X-Mailgun-Variables": JSON.stringify({
        clientName: submission.value.clientName,
        invoiceNumber: submission.value.invoiceNumber,
        invoiceDueDate: new Intl.DateTimeFormat("en-US", {
          dateStyle: "long",
        }).format(new Date(submission.value.dueDate)),
        invoiceAmount: formatCurrency({
          amount: submission.value.total,
          currency: submission.value.currency as any,
        }),
        invoiceLink:
          process.env.NODE_ENV !== "production"
            ? `http://localhost:3000/api/invoice/${data.id}`
            : `https://invoice-marshal.vercel.app/api/invoice/${data.id}`,
      }),
    });

    console.log("Invoice update email sent successfully via Mailgun.");
  } catch (error) {
    console.error("Mailgun Error:", error);
  }

  return redirect("/dashboard/invoices");
}


export async function DeleteInvoice(invoiceId: string) {
  const session = await requireUser();

  const data = await prisma.invoice.delete({
    where: {
      userId: session.user?.id,
      id: invoiceId,
    },
  });

  return redirect("/dashboard/invoices");
}

export async function MarkAsPaidAction(invoiceId: string) {
  const session = await requireUser();

  const data = await prisma.invoice.update({
    where: {
      userId: session.user?.id,
      id: invoiceId,
    },
    data: {
      status: "PAID",
    },
  });

  return redirect("/dashboard/invoices");
}
