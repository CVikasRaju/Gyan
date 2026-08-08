import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { NavigationLayout } from "@/components/layout/NavigationLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Gyan — Fact-checked. Source-attributed. Ad-free.",
  description:
    "An AI-powered daily current affairs digest. Fact-checked summaries, full source attribution, zero ads.",
  keywords: ["current affairs", "news digest", "fact-checked", "AI summaries"],
};

/**
 * Applies the saved/system theme before first paint to avoid a flash of
 * the wrong theme. Keep in sync with ThemeProvider.getInitialTheme().
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('gyan-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* beforeInteractive inlines this in the SSR <head> — avoids FOUC without
            rendering a raw <script> through React (which never executes client-side). */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body
        className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable} min-h-screen bg-canvas text-ink antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <NavigationLayout>{children}</NavigationLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
