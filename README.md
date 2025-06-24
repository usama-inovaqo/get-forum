# Forum Web App Frontend

## Getting Started

First, install dependencies and set up environment variables:

```bash
# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env
```

Then, run the development server:

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

## More setup requirements

- Ensure the backend is running locally
- Add email addresses to the Nylas Dashboard and to the Grant ID Dict in backend repo
- Set the NEXT_PUBLIC_USE_LOCAL_API environment variable to true if you want to use the local API, otherwise it will use the remote API
## Logging

To enable debug logging for API routes, set the following environment variable in your `.env` file:

```bash
NEXT_PUBLIC_API_ROUTES_LOGGING=true
```

When enabled, this will output detailed logging information for API route calls in the browser console.

## Learn More

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
