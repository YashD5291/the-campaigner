/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: false, // Disables body parsing, we'll handle it ourselves with multer
  },
};

export default nextConfig;
