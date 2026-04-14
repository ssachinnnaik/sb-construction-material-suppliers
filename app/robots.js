export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/login', '/api/'],
      },
    ],
    sitemap: 'https://sb-construction.onrender.com/sitemap.xml',
    host: 'https://sb-construction.onrender.com',
  };
}
