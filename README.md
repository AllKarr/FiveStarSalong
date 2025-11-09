# FiveStar Salong

An elegant **Next.js** e-commerce platform for hair and beauty products — built with **TypeScript**, **MongoDB**, and **Tailwind CSS**.  
The app includes an **admin dashboard** for product management and a fully functional **Stripe checkout** for secure purchases.

Live Demo: [https://fivestarsalong.onrender.com/](https://fivestarsalong.onrender.com/)  

---

## Features

### User Features
- Browse and search for products and bundles  
- Add items to cart and complete checkout via **Stripe**  
- View personal order history in profile  
- Update password and account details  
- Automatic session timeout for inactive users

###  Admin Features
- Add, edit, and remove products directly from the website  
- Manage orders: mark as complete, refund, or pending  
- View all user orders in the admin dashboard  
- Secure admin access with role-based authentication

### Payments
- Integrated **Stripe Checkout** for real credit/debit card payments  
- Order details automatically saved in **MongoDB**

---

## Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [Next.js 14+](https://nextjs.org/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Auth | [NextAuth.js](https://next-auth.js.org/) |
| Payments | [Stripe](https://stripe.com/) |
| Deployment | [Render](https://render.com/) |

---

## Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/AllKarr/FiveStarSalong.git
cd FiveStarSalong

2️⃣ Install dependencies
npm install

3️⃣ Create an .env.local file

Add the following environment variables (adjust as needed):

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

MONGODB_URI=your_mongodb_connection_string

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret

4️⃣ Run the development server
npm run dev


The app will be available at http://localhost:3000