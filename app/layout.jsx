import "@/index.css";

export const metadata = {
  metadataBase: new URL("https://www.andreapiano.dev"),

  title: {
    default: "Andrea Piano | Software Development & Digital Solutions",
    template: "%s | Andrea Piano",
  },

  description:
    "Explore Andrea Piano's portfolio. Software developer specializing in React, Next.js, TypeScript, graphic design, and digital marketing, with experience in analytics and business technology.",

  keywords: [
    "Andrea Piano",
    "Software Developer",
    "Frontend Developer",
    "React",
    "Next.js",
    "TypeScript",
    "UI/UX",
    "Digital Solutions",
    "Web Development",
    "Portfolio",
  ],

  authors: [{ name: "Andrea Piano" }],
  creator: "Andrea Piano",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Andrea Piano | Software Developer & Digital Solutions",
    description:
      "Digital Solutions Professional specializing in software development, digital marketing, and business technology. Explore my projects, skills, and experience.",
    url: "https://www.andreapiano.dev",
    siteName: "Andrea Piano",
    type: "website",
    locale: "en_US",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
