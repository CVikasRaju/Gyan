import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });
const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Gyan",
  description: "Your personalized current affairs digest.",
};

import { AuthProvider } from '@/components/auth/AuthProvider';
import { NavigationLayout } from '@/components/layout/NavigationLayout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL,GRAD,opsz@400,0..1,0,24&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-background text-on-background font-body-md antialiased overflow-hidden flex" suppressHydrationWarning>
        <AuthProvider>
          <NavigationLayout>
            {children}
          </NavigationLayout>
        </AuthProvider>
      </body>
    </html>
  );
}


