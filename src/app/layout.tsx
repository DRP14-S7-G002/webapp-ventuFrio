import Header from "@/components/header";
import "./globals.css";

import Menu from "@/components/menu";
import { BudgetProvider } from "@/hooks/budget";
import { ToastProvider } from "@/hooks/Toasts/ToastManager";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
      <ToastProvider>
        <Header/>
        <Menu/> 

        <BudgetProvider>
          <main>
            {children}
          </main>
        </BudgetProvider>
        </ToastProvider>
        <Footer/>
      </body>
    </html>
  );
}
