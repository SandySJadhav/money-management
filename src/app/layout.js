import "./globals.scss";

export const metadata = {
  title: "Welcome to Money Management",
  description: "Money Management App",
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
        <link rel="apple-touch-icon" href="/logo.jpg" sizes="any" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className="flex flex-col min-h-screen justify-between"
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
