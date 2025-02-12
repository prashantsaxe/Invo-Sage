# Invo-Sage

## 📌 Overview
**Invo-Sage** is a full-featured **Invoice Management System** built with **Next.js, Prisma, PostgreSQL, and TailwindCSS**. It allows users to **create, edit, manage, and send invoices** via **Mailtrap**. The system includes **authentication, dashboard analytics, and invoice tracking**.

## 🚀 Features
- 📝 **Create & Edit Invoices**: Users can generate invoices with client details, itemized lists, and due dates.
- 📧 **Email Invoices**: Send invoices via **Mailtrap** with customizable email templates.
- 📊 **Dashboard & Graphs**: Provides analytics on invoices.
- 🔒 **Authentication**: Secure login & authentication via **NextAuth.js**.
- 📅 **Date & Currency Formatting**: Supports multiple currencies and date formats.
- 📁 **File Structure Optimization**: Clean and modular architecture.
- 📄 **PDF Invoice Generation**: Uses `jspdf` to generate real PDF invoices that can be downloaded.
- 📎 **Downloadable Invoice Link**: Emails include a direct **downloadable invoice link** for clients.

---

## 🏗️ Tech Stack
- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Email Service**: [Mailtrap](https://mailtrap.io/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Package Manager**: [pnpm](https://pnpm.io/)

---

## 📂 Directory Structure
```
prashantsaxe-invo-sage/
├── app/                  # Next.js app router
│   ├── actions.ts        # Server actions for invoices
│   ├── api/              # API endpoints
│   │   ├── auth/         # Authentication routes
│   │   ├── email/        # Invoice email routes
│   │   └── invoice/      # Invoice management
│   ├── components/       # UI Components
│   ├── dashboard/        # User dashboard
│   ├── login/            # Login page
│   ├── onboarding/       # User onboarding
│   ├── utils/            # Utility functions & services
├── components/           # Reusable UI components
├── lib/                  # Helper functions
├── prisma/               # Prisma schema & migrations
├── public/               # Static assets
└── package.json          # Dependencies
```

---

## 🛠️ Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/prashantsaxe/invo-sage.git
cd prashantsaxe-invo-sage
```

### **2️⃣ Install Dependencies**
```sh
pnpm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory and configure the following variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/invo-sage
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
MAILTRAP_TOKEN=your_mailtrap_api_key
```

### **4️⃣ Run Migrations & Generate Prisma Client**
```sh
npx prisma migrate dev --name init
npx prisma generate
```

### **5️⃣ Start the Development Server**
```sh
pnpm dev
```
App will be available at **http://localhost:3000**

---

## ✉️ Email Configuration (Mailtrap)
Ensure you have a **Mailtrap account** and update your `mailtrap.ts` file inside `app/utils/`. The email templates are stored inside **Mailtrap’s UI** and referenced using `template_uuid`.

```typescript
emailClient.send({
  from: { email: "hello@demomailtrap.com", name: "Invo-Sage" },
  to: [{ email: "recipient@example.com" }],
  template_uuid: "your-template-uuid",
  template_variables: {
    client_name: "John Doe",
    invoice_number: "1234",
    invoice_due_date: "March 10, 2024",
    invoice_amount: "$500.00",
    invoice_link: "http://localhost:3000/api/invoice/1234",
  },
});
```

---

## 📜 API Endpoints
| Method | Endpoint                  | Description             |
|--------|--------------------------|-------------------------|
| `POST` | `/api/invoice`            | Create an invoice      |
| `GET`  | `/api/invoice/{id}`       | Get invoice details    |
| `PUT`  | `/api/invoice/{id}`       | Update invoice         |
| `DELETE` | `/api/invoice/{id}`    | Delete invoice         |
| `POST` | `/api/email/{invoiceId}`  | Send invoice via email |

---

## 📝 To-Do / Future Enhancements
- ✅ Implement Stripe or Razorpay for invoice payments
- ✅ Add PDF invoice generation
- ✅ Improve email templates & branding
- ✅ Optimize invoice search & filtering

---

## 💡 Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Added feature XYZ"`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request.

---

## 📄 License
This project is licensed under the **MIT License**.

---

## 📞 Contact
- GitHub: [prashantsaxe](https://github.com/prashantsaxe)
- Email: support@invo-sage.com

🚀 **Built with ❤️ by Prashant Saxena & Contributors**

---

## ⚠️ Disclaimer
**Using this project to send invoices to personal accounts will require users to contact me via email, as Mailtrap’s free plan does not allow multiple recipients.**

