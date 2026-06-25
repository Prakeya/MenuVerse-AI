import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata = {
  title: "MenuVerse AI | Restaurant Operating System",
  description: "AI-Powered Restaurant Operating System. Manage menus, orders, and restaurant insights seamlessly.",
  keywords: ["menuverse", "restaurant os", "menu manager", "order tracker", "ai restaurant"],
  authors: [{ name: "MenuVerse Team" }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>{children}</body>
    </html>
  );
}
