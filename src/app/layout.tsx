import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ITSEIA - Instituto Ecuatoriano de Inteligencia Artificial",
    template: "%s | ITSEIA Academy",
  },
  description:
    "Campus virtual del Instituto Ecuatoriano de Inteligencia Artificial. Carreras en IA, Ciencia de Datos y Big Data con AI Lab integrado. Quito, Ecuador.",
  keywords: [
    "ITSEIA",
    "inteligencia artificial",
    "ciencia de datos",
    "big data",
    "campus virtual",
    "Ecuador",
    "Quito",
    "educacion IA",
    "cursos IA",
    "AI Lab",
  ],
  authors: [{ name: "ITSEIA", url: "https://itseia.ai" }],
  creator: "ITSEIA",
  metadataBase: new URL("https://tecnologico.itseia.ai"),
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "https://tecnologico.itseia.ai",
    siteName: "ITSEIA Academy",
    title: "ITSEIA - Instituto Ecuatoriano de Inteligencia Artificial",
    description:
      "Campus virtual con AI Lab integrado. Carreras en IA, Ciencia de Datos y Big Data.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ITSEIA Academy",
    description:
      "Campus virtual del Instituto Ecuatoriano de Inteligencia Artificial.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
