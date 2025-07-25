import "./globals.css";
import SessionProviderWrapper from '@/components/SessionProviderWrapper';

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen justify-between">
        <main className="relative sm:px-10 md:px-30 lg:px-50 2xl:px-80 bg-gray-200 min-h-screen flex flex-col">
          <SessionProviderWrapper className="flex-grow flex flex-col">
            {children}
          </SessionProviderWrapper>
        </main>
      </body>
    </html>
  );
}