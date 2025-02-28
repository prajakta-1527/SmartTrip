/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // cloudinary
      'res.cloudinary.com',
      // google login
      'lh3.googleusercontent.com',
    ],
  },
};

module.exports = nextConfig;
