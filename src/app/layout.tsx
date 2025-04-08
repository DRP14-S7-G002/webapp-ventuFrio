import Header from "@/components/header";
import "./globals.css";

import Menu from "@/components/menu";
import { BudgetProvider } from "@/hooks/budget";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <Header/>
        <Menu/>
        <BudgetProvider>
         
            {children}
        </BudgetProvider>
      </body>
    </html>
  );
}
