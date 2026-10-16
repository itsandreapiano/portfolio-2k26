import "@/index.css";

export const metadata = {
  metadataBase: new URL("https://www.andreapiano.dev"),

  title: {
    default: "Andrea Piano | Software Engineer & Digital Solutions",
    template: "%s | Andrea Piano",
  },

  description:
    "Explore Andrea Piano's portfolio. Software engineer specializing in React, Next.js, TypeScript, UI/UX, and digital solutions, with experience in analytics and business technology.",

  keywords: [
    "Andrea Piano",
    "Software Engineer",
    "Frontend Engineer",
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
    title: "Andrea Piano | Software Engineer & Digital Solutions",
    description:
      "Software engineering, UI/UX, and digital solutions. Explore my projects, skills, and professional experience.",
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
