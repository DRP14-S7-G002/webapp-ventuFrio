import Header from "@/components/header";
import "./globals.css";

import Menu from "@/components/menu";
import { BudgetProvider } from "@/hooks/budget";
import { ToastProvider } from "@/hooks/Toasts/ToastManager";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
      <ToastProvider>
        <Header/>
        <Menu/> 

        <BudgetProvider>
         
            {children}
        </BudgetProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
