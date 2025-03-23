# Email Campaigner

A Next.js application for sending personalized email campaigns with tracking capabilities.

## Features

- Send personalized emails to multiple recipients
- Upload and parse CSV files with contact information
- Attach PDF files to emails
- Rich text editor for composing emails
- Email open tracking with pixel tracking
- Real-time tracking dashboard
- Responsive design

## Email Tracking

The application includes pixel tracking functionality to track when recipients open emails. This works by embedding a tiny, invisible image in each email that loads from your server when the email is opened. The tracking data is displayed in a dashboard accessible at `/tracking-dashboard`.

**Note on Email Tracking:**
- Email tracking only works when the recipient's email client loads images
- The recipient must be connected to the internet when opening the email
- The email must be viewed in HTML format (not plain text)
- Some email clients block tracking pixels by default

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

The `VERCEL_URL` environment variable is automatically set by Vercel, which the application uses to construct the tracking pixel URL.

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
