import type { Metadata } from "next";
import "./globals.css";
// 1. Importujeme našeho providera
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
    title: "Golem App",
    description: "Virtual pet for developers",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        {/* 2. Obalíme celou aplikaci */}
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}