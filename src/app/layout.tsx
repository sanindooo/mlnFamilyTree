import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

const playfairDisplay = Playfair_Display({
	variable: "--font-playfair-display",
	subsets: ["latin"],
	weight: ["500", "700"],
});

const lato = Lato({
	variable: "--font-lato",
	subsets: ["latin"],
	weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
	title: "Virtual Museum of Martin Luther Nsibirwa",
	description:
		"Preserving and celebrating the life and contributions of Owek. Martin Luther Nsibirwa and his descendants.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${playfairDisplay.variable} ${lato.variable}`}>
			<body className={`font-sans antialiased bg-cream text-deep-umber`}>
				<SmoothScroll>
					<Navbar />
					<main>{children}</main>
					<Footer />
				</SmoothScroll>
			</body>
		</html>
	);
}
