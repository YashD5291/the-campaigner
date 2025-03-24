# Email Campaigner

A Next.js application for sending personalized email campaigns.

## Features

- Send personalized emails to multiple recipients
- Upload and parse CSV files with contact information
- Attach PDF files to emails
- Rich text editor for composing emails
- Responsive design

## Deployment on Vercel

This application is optimized for deployment on Vercel. Follow these steps to deploy:

1. Fork or clone this repository
2. Create a Vercel account if you don't have one
3. Import your repository to Vercel
4. Set up the following environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_BASE_URL`: The URL of your deployed application (e.g., https://your-app.vercel.app)
   - `EMAIL_USER`: Your email address (for sending emails)
   - `EMAIL_PASSWORD`: Your email app password (for Gmail, create an app password)
   - `EMAIL_SENDER_NAME`: Your name as it should appear in the email

## Development

To run the application locally:

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env.local` file based on the provided `.env.local.example`
4. Run the development server with `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- Next.js 14+
- TypeScript
- React
- Node.js
- Nodemailer (for email sending)
- Vercel (for deployment)

## License

MIT
