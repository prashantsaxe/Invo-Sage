import FormData from "form-data";
import Mailgun from "mailgun.js";

export const emailClient = new Mailgun(FormData).client({
  username: "api",
  key: process.env.API_KEY || "API_KEY",
});
