import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageTransitionWrapper } from "@/components/page-transition";
import { MeshGradient } from "@/components/ui/mesh-gradient";
import { LeftSidebar } from "@/components/left-sidebar";
import { AppDock } from "@/components/app-dock";
import { RouteChangeLoader } from "@/components/route-change-loader";

const locales = ["en", "ar"];

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EduVerse — Premium Coding Education",
    template: "%s — EduVerse",
  },
  description: "A premium coding education platform with structured courses, interactive coding exercises, placement exams, and gamified learning. Master Python, JavaScript, HTML/CSS, and C++.",
  applicationName: "EduVerse",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = params.locale;
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${bodyFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme")||"dark";document.documentElement.classList.add(t);document.documentElement.dir="${dir}";}catch(e){}`,
          }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <RouteChangeLoader />
            <Header />
            <MeshGradient />
            <LeftSidebar />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-[var(--radius)]"
            >
              Skip to content
            </a>
            <main id="main-content" className="min-h-[calc(100vh-3.5rem)] pb-20 lg:pb-0 lg:ml-64">
              <PageTransitionWrapper>{children}</PageTransitionWrapper>
            </main>
            <AppDock />
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
