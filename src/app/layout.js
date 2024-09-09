import "./globals.css";

export const metadata = {
  title: "كارت معايدة",
  description: "كارت معايدة أمانه منطقة نجران",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="dark:bg-[#dbdfe0]">{children}</body>
    </html>
  );
}
