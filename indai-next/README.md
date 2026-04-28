# IndAI Project Setup

## 🟢 MongoDB Configuration (Required for Email/Password Authentication)

This Next.js application relies on MongoDB to store user accounts. To use the **Sign Up** and **Email Login** features on the landing page, you must provide a valid MongoDB connection string.

### How to set it up:

1. Create a file named `.env.local` in the root `indai-next` directory (at the same level as `package.json`).
2. Add your MongoDB URI to the file exactly like this:

```env
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/indaiAuth?retryWrites=true&w=majority"
```

*(Note: Replace `<username>`, `<password>`, and the cluster URL with your actual MongoDB Atlas credentials).*

3. Restart your Next.js development server to pick up the new environment variables:
   - Terminate the current `npm run dev` session with `Ctrl + C`.
   - Start it again by running `npm run dev`.

If you don't have a MongoDB cluster, you can create a free one at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
