import "@/index.css";

export const metadata = {
  title: "Andrea Piano | Software Engineer",
  description:
    "Personal portfolio of Andrea Piano, a software engineer specializing in React, Next.js, and TypeScript.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
