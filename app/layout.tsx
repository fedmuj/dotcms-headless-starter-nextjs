import { Inter } from "next/font/google";
import "./globals.css";

/*
 * Root layout — wraps every page in the app.
 * Exposes Inter as the --font-inter CSS variable, which the Tailwind theme's
 * --font-sans token consumes (see globals.css). Applying `font-sans` on the
 * body then flows Inter through every component via the design system.
 * Any UI added here (e.g. a toast provider) will appear on all routes.
 */
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  );
}
