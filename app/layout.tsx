import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import './globals.css';
import { Hanken_Grotesk } from 'next/font/google';
import { AuthProvider } from "@/api/AuthContext";

const hankenGrotesk = Hanken_Grotesk({ subsets: ['latin'] });

export const metadata = {
  title: 'HelpingHand',
  description: 'Connecting volunteers with impactful opportunities to make a difference in their communities.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${hankenGrotesk.className} flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow relative">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
