import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/theme/theme-provider';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Favicon from '../components/Favicon';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Avatar Assistant',
  description: 'An intelligent AI avatar assistant that helps you with various tasks',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Favicon />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-20">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}