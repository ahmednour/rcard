import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata = {
  title: "كارت معايدة",
  description: "كارت معايدة أمانه منطقة نجران",
  icons: {
    icon: "/fav.ico",
    shortcut: "/fav.ico",
    apple: "/fav.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="dark:bg-[#dbdfe0] min-h-screen w-full overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
