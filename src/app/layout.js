import { Inter } from "next/font/google";
import classNames from "classnames";
import "./globals.scss";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          type="image/x-icon"
          href="/favicon.ico"
          sizes="96x96"
        />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta charSet="utf-8" />
        <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet' />
        <link href='https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css' rel='stylesheet' />
        <link rel="apple-touch-icon" href="/logo.jpg" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={classNames(
          inter.className,
          "flex flex-col min-h-screen justify-between"
        )}
        id="app-body"
      >
        {children}
        {/* <footer
          data-testid="footer"
          className="relative p-4 text-sm border-solid border border-[#c4c4c4] border-x-0 border-b-0 md:flex md:items-center md:justify-between"
        >
          Footer
        </footer> */}
      </body>
    </html>
  );
}
