import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "../providers/ReduxProvider";
import { AuthProvider } from "../providers/AuthProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "AiChat-bot",
    template: "%s | AiChat-bot",
  },
  description: "Chat with an AI assistant powered by Gemini.",
  icons: {
    icon: "/file.svg",
  },
  openGraph: {
    title: "AiChat-bot",
    description: "Chat with an AI assistant powered by Gemini.",
    url: "https://localhost/",
    siteName: "AiChat-bot",
    type: "website",
  },
  metadataBase: new URL("https://localhost/"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <AuthProvider>
       <ReduxProvider>
        {children}
        </ReduxProvider>
       </AuthProvider>
      </body>
    </html>
  );
}
